"use strict";
const PathHelper = require("../helpers/PathsHelper");
const DatabaseHelper = require("../helpers/DatabaseHelper");

const collection = "paths";
const tracksDir = __dirname + "/../database/collections/tracks/";

module.exports = {
  up(db, next) {
    PathHelper.Parse.Directory.gpx(tracksDir)
      .then(paths => {
        DatabaseHelper.insert({
          database: db,
          next: next,
          collection: collection,
          docs: paths
        })
          .then(data => next())
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  },

  down(db, next) {
    DatabaseHelper.remove({ database: db, collection: collection })
      .then(data => next())
      .catch(err => console.log(err));
  }
};
