"use strict";
const DatabaseUtil = require("../helpers/DatabaseHelper");
const KeyPoint = require("../models/transports/KeyPointModel");

const collection = "keypoints";
var universities = require("../database/collections/universities.json");

module.exports = {
  up(db, next) {
    universities = universities.map(university => {
      var data = {
        name: university.name,
        location: {
          lat: university.lat,
          lon: university.lon
        }
      };
      return new KeyPoint(data);
    });
    DatabaseUtil.insert({
      database: db,
      collection: collection,
      docs: universities,
      filename: "universities"
    })
      .then(data => next())
      .catch(err => console.log(err));
  },

  down(db, next) {
    DatabaseUtil.remove({
      database: db,
      collection: collection,
      filename: "universities"
    })
      .then(data => next())
      .catch(err => console.log(err));
  }
};
