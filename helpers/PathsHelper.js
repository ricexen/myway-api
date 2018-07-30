const File = require("./Util").File;
const Validation = require("./Util").Validation;
const Path = require("../models/transports/PathModel");
const Price = require("../models/transports/PriceModel");

const prices = require("../database/collections/prices.json");

var PathHelper = {
  parseGpxsFromDir: dir => {
    return new Promise((resolve, reject) => {
      var paths = [];
      File.listFiles(dir, "gpx")
        .then(files => {
          files.forEach(filename => {
            PathHelper.parseGpx(filename)
              .then(path => {
                paths.push(path);
                if (Validation.areSameLenght(files, paths)) resolve(paths);
              })
              .catch(err => reject(err));
          });
        })
        .catch(err => reject(err));
    });
  },
  parseGpx: filename => {
    return new Promise((resolve, reject) => {
      File.xmlToJson(filename)
        .then(json => {
          const path = new Path({
            name: json.gpx.trk[0].name,
            line: json.gpx.trk[0].trkseg[0].trkpt.map(
              trackPoint => trackPoint["$"]
            ),
            prices: prices.map(price => new Price(price))
          });
          resolve(path);
        })
        .catch(err => reject(err));
    });
  }
};

module.exports = PathHelper;
