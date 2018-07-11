"use strict";
const ospath = require("path");
const File = require("../helpers/Util").File;
const Path = require("../models/transports/PathModel");
const DataBase = require("../helpers/DatabaseUtil");
const ObjectId = require("mongodb").ObjectID;

var paths = [];
var gpxCount = 0;
const tracksDir = __dirname + "/../database/tracks/";

module.exports = {
  up(db, next) {
    File.listDirectory(tracksDir)
      .then(files => {
        gpxCount = gpxFilesCount(files);
        files.forEach(filename => {
          const file = tracksDir + filename;
          trackFromGpx(file)
            .then(track => {
              const path = new Path({
                name: track.name,
                line: track.points
              });
              path.save();
              paths.push(path);
              if (gpxCount == paths.length) {
                db.collection("paths").insert(paths, (err, inserted) => {
                  if (err) console.log(err);
                  else
                    DataBase.writeIdentifiers(inserted.ops)
                      .then(next())
                      .catch(err => console.log(err));
                });
              }
            })
            .catch(err => console.log(err));
        });
      })
      .catch(err => console.log(err));
  },

  down(db, next) {
    var ids = require("../database/.temp/paths.json");
    db.collection("paths").remove(
      { _id: { $in: ids.map(id => ObjectId(id)) } },
      (err, commandResult) => {
        if (err) console.log(err);
        else console.log(commandResult.result, "Done");
      }
    );
    next();
  }
};

var trackFromGpx = file => {
  return new Promise((resolve, reject) => {
    File.xmlToJson(file)
      .then(xml => {
        var track = {
          name: xml.gpx.trk[0].name,
          points: xml.gpx.trk[0].trkseg[0].trkpt.map(
            trackPoint => trackPoint["$"]
          )
        };
        resolve(track);
      })
      .catch(err => reject(err));
  });
};

var gpxFilesCount = (files = []) => {
  var count = 0;
  for (var i = 0; i < files.length; i++) {
    if (ospath.extname(files[i]) == ".gpx") count++;
  }
  return count;
};
