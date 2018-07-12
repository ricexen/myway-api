const fs = require("fs");
const xmlParser = new require("xml2js").Parser();
module.exports = {
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
    }
  },
  Filter: {
    unique(value, index, self) {
      return self.indexOf(value) === index;
    }
  },
  Validation: {
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
    }
  }
};
