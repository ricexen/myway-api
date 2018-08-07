const File = require("./Util").File;
const Validation = require("./Util").Validation;
const Path = require("../models/transports/PathModel");
const Price = require("../models/transports/PriceModel");
const KeyPoint = require("../models/transports/KeyPointModel");

const prices = require("../database/collections/prices.json");

const findPathsOfUniversity = name => {
  return new Promise((resolve, reject) => {
    findUniversityKeyPoint(name)
      .catch(err => reject(err))
      .then(keypoint => {
        Path.find({ keypoints: keypoint })
          .catch(err => reject(err))
          .then(paths => resolve(paths));
      });
  });
};

const findUniversityKeyPoint = name => {
  return new Promise((resolve, reject) => {
    findKeyPointsByTags(["university", "universidad"])
      .catch(err => reject(err))
      .then(keypoints => {
        for (var i = 0; i < keypoints.length; i++) {
          const keypoint = keypoints[i];
          if (String(keypoint.name) === String(name)) {
            resolve(keypoint);
          }
        }
        reject({ message: "KeyPoint not found" });
      });
  });
};

/**
 *
 * @param {Array} tags
 */
const findKeyPointsByTags = tags => {
  return new Promise((resolve, reject) => {
    var command = KeyPoint.find();
    for (var i = 0; i < tags.length; i++) {
      const tag = tags[i];
      command.or({ tags: tag });
    }
    command.catch(err => reject(err)).then(keypoints => resolve(keypoints));
  });
};

const parseGpxsFromDir = dir => {
  return new Promise((resolve, reject) => {
    var paths = [];
    File.listFiles(dir, "gpx")
      .then(files => {
        files.forEach(filename => {
          parseGpx(filename)
            .then(path => {
              paths.push(path);
              if (Validation.areSameLenght(files, paths)) resolve(paths);
            })
            .catch(err => reject(err));
        });
      })
      .catch(err => reject(err));
  });
};

const parseGpx = filename => {
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
};

module.exports = {
  Parse: {
    gpx: parseGpx,
    Directory: {
      gpx: parseGpxsFromDir
    }
  },
  Find: {
    PathsUniversity: findPathsOfUniversity,
    UniversityKeyPoint: findUniversityKeyPoint,
    KeyPointsByTags: findKeyPointsByTags
  }
};
