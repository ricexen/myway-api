require("pluralizer");
const Validation = require("./Util").Validation;
const File = require("./Util").File;
const ObjectId = require("mongodb").ObjectID;

const tempDirectory = __dirname + "/../database/.temp/";

DatabaseHelper = {
  Identifiers: {
    write(docs, options = { identifier: null, filename: null, dir: null }) {
      return new Promise((resolve, reject) => {
        if (!Validation.isArray(docs))
          reject(new Error("docs must be an Array"));
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
    delete(collection) {
      return new Promise((resolve, reject) => {
        File.delete(tempDirectory + collection + ".json")
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
  },
  Log: {
    down(removed, next) {
      if (removed.result.n == 0) console.log("Nothing removed");
      else {
        console.log("Docs removed:", removed.result.n);
        next();
      }
    },
    up(inserted, next) {
      if (inserted.result.n == 0) console.log("Nothing inserted");
      else {
        console.log("Docs inserted: ", inserted.result.n);
        next();
      }
    }
  },
  Map: {
    id: id => ObjectId(id)
  },
  insert(
    options = {
      database: null,
      next: null,
      collection: null,
      docs: [],
      log: true
    }
  ) {
    var database = options.db,
      collection = options.collection,
      docs = options.docs,
      next = options.next,
      log = options.log;
    return new Promise((resolve, reject) => {
      database.collection(collection).insert(docs, (err, inserted) => {
        if (err) reject(err);
        else
          DataBase.Identifiers.write(inserted.ops)
            .then(data => {
              if (log) DatabaseHelper.Log.up(inserted, next);
              resolve(data);
            })
            .catch(err => reject(err));
      });
    });
  },
  remove(
    options = {
      database: null,
      next: null,
      collection: null,
      docs: [],
      log: true
    }
  ) {
    var database = options.db,
      collection = options.collection,
      docs = options.docs,
      next = options.next,
      log = options.log;

    return new Promise((resolve, reject) => {
      database.collection(collection).remove(docs, (err, removed) => {
        if (err) reject(err);
        else
          DatabaseHelper.Identifiers.delete(collection)
            .then(data => {
              if (log) DatabaseHelper.Log.down(removed, next);
              resolve(data);
            })
            .catch(err => reject(err));
      });
    });
  }
};

module.exports = DatabaseHelper;
