const fs = require("fs");
const ospath = require("path");
const xmlParser = new require("xml2js").Parser();

var Util = {
  File: {
    xmlToJson(file) {
      return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
          if (err) reject(err);
          else {
            xmlParser.parseString(data, (err, xml) => {
              if (err) reject(err);
              else resolve(xml);
            });
          }
        });
      });
    },
    writeJson(json, filename) {
      return new Promise((resolve, reject) => {
        var data = JSON.stringify(json);
        fs.writeFile(filename, data, "utf8", err => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    },
    listDirectory(dir) {
      return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
          if (err) reject(err);
          else resolve(files);
        });
      });
    },
    listFiles(dir, ext) {
      ext = "." + ext;
      return new Promise((resolve, reject) => {
        this.listDirectory(dir)
          .then(files => {
            var filesWithExtension = [];
            for (var i = 0; i < files.length; i++) {
              if (ospath.extname(files[i]) == ext)
                filesWithExtension.push(dir + files[i]);
            }
            resolve(filesWithExtension);
          })
          .catch(err => reject(err));
      });
    },
    delete(filename) {
      return new Promise((resolve, reject) => {
        fs.unlink(filename, err => {
          if (err) reject(err);
          else resolve(filename);
        });
      });
    }
  },
  Filter: {
    unique(value, index, self) {
      return self.indexOf(value) === index;
    }
  },
  Validation: {
    isEmpty(obj) {
      var empty = true;
      for (var key in obj) {
        if (empty && obj.hasOwnProperty(key)) empty = false;
      }
      return empty;
    },
    isArray(value) {
      return value && typeof value === "object" && value.constructor === Array;
    },
    isString(value) {
      return typeof value === "string" || value instanceof String;
    },
    isNumber(value) {
      return typeof value === "number" && isFinite(value);
    },
    isFunction(value) {
      return typeof value === "function";
    },
    isObject(value) {
      return value && typeof value === "object" && value.constructor === Object;
    },
    isNull(value) {
      return value === null;
    },
    isBoolean(value) {
      return typeof value === "boolean";
    },
    isRegExp(value) {
      return value && typeof value === "object" && value.constructor === RegExp;
    },
    isError(value) {
      return value instanceof Error && typeof value.message !== "undefined";
    },
    isDate(value) {
      return value instanceof Date;
    },
    isSymbol(value) {
      return typeof value === "symbol";
    },
    isLastIndex(index, array = []) {
      return index == array.length - 1;
    },
    areSameLenght(object1, object2) {
      return object1.length == object2.length;
    }
   
  }
};
module.exports = Util;
