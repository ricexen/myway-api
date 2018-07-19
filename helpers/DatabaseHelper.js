require("pluralizer");
const Validation = require("./Util").Validation;
const File = require("./Util").File;
const ObjectId = require("mongodb").ObjectID;

const tempDirectory = __dirname + "/../database/.temp/";

var DatabaseHelper = {};

DatabaseHelper.Identifiers = {
  write(docs, options = { identifier: null, filename: null, dir: null }) {
    return new Promise((resolve, reject) => {
      if (!Validation.isArray(docs)) reject(new Error("docs must be an Array"));
      else if (Validation.isNull(docs[0]))
        reject(new Error("The Array must not have null docs"));
      else {
        var identifiers = [];
        for (var i = 0; i < docs.length; i++) {
          const object = docs[i];
          identifiers.push(object[options.identifier || "_id"]);
        }
        if (!options.filename) {
          var constructorName = docs[0].constructor.modelName.toLowerCase();
          options.filename = constructorName.pluralize();
        }
        File.writeJson(
          identifiers,
          (tempDirectory || options.dir) + options.filename + ".json"
        )
          .then(data => resolve(data))
          .catch(err => reject(err));
      }
    });
  },
  delete(options = { collection: null, filename: null }) {
    return new Promise((resolve, reject) => {
      var filename = options.filename || options.collection;
      filename = tempDirectory + filename + ".json";
      File.delete(filename)
        .then(deleted => {
          resolve(deleted);
        })
        .catch(err => reject(err));
    });
  },
  fromJson(collection) {
    return new Promise((resolve, reject) => {
      try {
        var json = require(tempDirectory + collection + ".json");
        var ids = json.map(id => ObjectId(id));
        resolve(ids);
      } catch (err) {
        reject(err);
      }
    });
  }
};
DatabaseHelper.Log = {
  down(removed) {
    if (removed.result.n == 0) console.log("Nothing removed");
    else console.log("Docs removed:", removed.result.n);
  },
  up(inserted) {
    if (inserted.result.n == 0) console.log("Nothing inserted");
    else console.log("Docs inserted: ", inserted.result.n);
  }
};

DatabaseHelper.Map = {
  id: id => ObjectId(id)
};

DatabaseHelper.insert = (
  options = {
    database: null,
    collection: null,
    docs: [],
    log: true,
    filename: null
  }
) => {
  var database = options.database,
    collection = options.collection,
    docs = options.docs,
    log = options.log;
  return new Promise((resolve, reject) => {
    database.collection(collection).insert(docs, (err, inserted) => {
      if (err) reject(err);
      else
        DatabaseHelper.Identifiers.write(inserted.ops, {
          filename: options.filename || null
        })
          .then(data => {
            if (log) DatabaseHelper.Log.up(inserted);
            resolve(data);
          })
          .catch(err => reject(err));
    });
  });
};

DatabaseHelper.remove = (
  options = {
    database: null,
    collection: null,
    query: null,
    log: true,
    filename: null
  }
) => {
  const jsonFilename =
    tempDirectory + (options.filename || options.collection) + ".json";
  const arrayOfIds = require(jsonFilename).map(id => ObjectId(id));
  const defaultQuery = { _id: { $in: arrayOfIds } };

  var db = options.database,
    collection = options.collection,
    query = options.query || defaultQuery,
    log = options.log;
  return new Promise((resolve, reject) => {
    db.collection(collection).remove(query, (err, removed) => {
      if (err) reject(err);
      else if (removed.result.n == 0) {
        reject({
          info: new Error("Nothing removed"),
          query: query,
          ids: query._id["$in"]
        });
      } else
        DatabaseHelper.Identifiers.delete({
          collection: collection,
          filename: options.filename
        })
          .then(data => {
            if (log) DatabaseHelper.Log.down(removed);
            resolve(data);
          })
          .catch(err => reject(err));
    });
  });
};

module.exports = DatabaseHelper;
