"use strict";
const Path = require("../models/transports/PathModel");

module.exports = {
  up(db, next) {
    const playasCentro = require("../test-data/tracks/map.json").features[0];
    const path = new Path({
      name: playasCentro.properties.name,
      line: playasCentro.geometry.coordinates.map(coordinate => {
        return { lat: coordinate[0], lon: coordinate[1] };
      })
    });
    path.save();
    db.collection("paths").insert(path);
    console.log(path);
    next();
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    next();
  }
};
