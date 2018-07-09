"use strict";
const fs = require("fs");
const Path = require("../models/transports/PathModel");
const playasCentro = require("../test-data/tracks/map.json").features[0];
var idsAdded = [];
const ObjectId = require("mongoose").Schema.Types.ObjectId;

module.exports = {
  up(db, next) {
    const path = new Path({
      name: playasCentro.properties.name,
      line: playasCentro.geometry.coordinates.map(coordinate => {
        return { lat: coordinate[0], lon: coordinate[1] };
      })
    });
    path.save(); // it is used for auto generate the creted at and updated at dates
    db.collection("paths").insert(path);
    idsAdded.push(path._id);
    fs.writeFile(
      __dirname + "/../test-data/tracks/added.json",
      JSON.stringify(idsAdded),
      "utf8",
      (err, data) => {
        if (err) console.log(err);
      }
    );
    console.log("Path added:", path.name);

    next();
  },

  down(db, next) {
    idsAdded = require("../test-data/tracks/added.json");
    console.log(idsAdded);
    for (var i = 0, id = idsAdded[i]; i < idsAdded.length; i++) {
      db.collection("paths").remove(ObjectId(id), (err, obj) => {
        if (err) console.log(err);
      });
    }
    next();
  }
};
