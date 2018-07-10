"use strict";
const fs = require("fs");
const ospath = require("path");
const gpx = require("gpx-parse");
const Path = require("../models/transports/PathModel");
const ObjectId = require("mongoose").Schema.Types.ObjectId;
var idsAdded = [];
const tracksDir = __dirname + "/../test-data/tracks";
var writeIdsAdded = () => {
  fs.writeFile(
    __dirname + "/../test-data/tracks/added.json",
    JSON.stringify(idsAdded),
    "utf8",
    (err, data) => {
      if (err) console.log(err);
    }
  );
};

module.exports = {
  up(db, next) {
    fs.readdir(tracksDir, (err, files) => {
      if (err) console.log(err);
      else {
        for (var i = 0, path; i < files.length; i++) {
          const file = tracksDir + "/" + files[i];
          if (ospath.extname(file) == ".gpx") {
            gpx.parseGpxFromFile(file, (err, gpx) => {
              const path = new Path({
                name: gpx.tracks[0].name,
                line: gpx.tracks[0].segments[0].map(segment => {
                  return { lat: segment.lat, lon: segment.lon };
                })
              });
              path.save();
              idsAdded.push(path._id);
            });
          }
        }
      }

      next();
    });
  },

  down(db, next) {
    // idsAdded = require("../test-data/tracks/added.json");
    // console.log(idsAdded);
    // for (var i = 0, id = idsAdded[i]; i < idsAdded.length; i++) {
    //   db.collection("paths").remove(ObjectId(id), (err, obj) => {
    //     if (err) console.log(err);
    //   });
    // }
    next();
  }
};
