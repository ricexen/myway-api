"use strict";
const PathHelper = require("../helpers/PathsHelper");
const DataBase = require("../helpers/DatabaseUtil");
const ObjectId = require("mongodb").ObjectID;

const tracksDir = __dirname + "/../database/collections/tracks/";

module.exports = {
  up(db, next) {
    PathHelper.parseGpxsFromDir(tracksDir)
      .then(paths => {
        DataBase.insert(db, next, paths);
      })
      .catch(err => console.log(err));
  },

  down(db, next) {
    var ids = require("../database/.temp/paths.json");
    db.collection("paths").remove(
      { _id: { $in: ids.map(id => ObjectId(id)) } },
      (err, commandResult) => {
        if (err) console.log(err);
        else {
          console.log(commandResult.result, "Done");
          next();
        }
      }
    );
  }
};

var insertPaths = (db, next, paths) => {
  db.collection("paths").insert(paths, (err, inserted) => {
    if (err) console.log(err);
    else
      DataBase.Identifi(inserted.ops)
        .then(next())
        .catch(err => console.log(err));
  });
};
