require("pluralizer");
const Validation = require("./Util").Validation;
const File = require("./Util").File;

const tempDirectory = __dirname + "/../database/.temp/";

module.exports = {
  writeIdentifiers(
    objects,
    options = {
      identifier: "_id",
      filename: null,
      dir: tempDirectory
    }
  ) {
    return new Promise((resolve, reject) => {
      if (!Validation.isArray(objects))
        reject(new Error("objects must be an Array"));
      else if (Validation.isNull(objects[0]))
        reject(new Error("The Array must have not null objects"));
      else {
        var identifiers = [];
        for (var i = 0; i < objects.length; i++) {
          const object = objects[i];
          identifiers.push(object[options.identifier]);
        }
        if (!options.filename) {
          var constructorName = objects[0].constructor.modelName.toLowerCase();
          options.filename = constructorName.pluralize() + ".json";
        }
        File.writeJson(identifiers, options.dir + options.filename)
          .then(data => resolve(data))
          .catch(err => reject(err));
      }
    });
  }
};
