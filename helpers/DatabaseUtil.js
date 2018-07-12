require("pluralizer");
const Validation = require("./Util").Validation;
const File = require("./Util").File;
const ObjectId = require("mongodb").ObjectID;

const tempDirectory = __dirname + "/../database/.temp/";

module.exports = {
  writeIdentifiers(
    objects,
    options = {
      identifier: null,
      filename: null,
      dir: null
    }
  ) {
    return new Promise((resolve, reject) => {
      if (!Validation.isArray(objects))
        reject(new Error("objects must be an Array"));
      else if (Validation.isNull(objects[0]))
        reject(new Error("The Array must not have null objects"));
      else {
        var identifiers = [];
        for (var i = 0; i < objects.length; i++) {
          const object = objects[i];
          identifiers.push(object[options.identifier || "_id"]);
        }
        if (!options.filename) {
          var constructorName = objects[0].constructor.modelName.toLowerCase();
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
  identifiersFromJsonFile(filename) {
    return new Promise((resolve, reject) => {
      try {
        resolve(
          require("../database/.temp/" + filename + ".json").map(id =>
            ObjectId(id)
          )
        );
      } catch (err) {
        reject(err);
      }
    });
  },
  downLog(err, removed, next) {
    if (err) console.log(err);
    else if (removed.result.n == 0) console.log("Nothing removed");
    else {
      console.log("Docs removed:", removed.result.n);
      next();
    }
  },
  upLog(err, inserted, next) {
    if (err) console.log(err);
    else if (inserted.result.n == 0) console.log("Nothing inserted");
    else {
      console.log("Docs inserted: ", inserted.result.n);
      next();
    }
  },
  Map: {
    id: id => ObjectId(id)
  },
  Find: (collection, query, callback) => {

  }
};
