"use strict";
const Price = require("../models/transports/PriceModel");
const DatabaseHelper = require("../helpers/DatabaseHelper");

const collection = "prices";
const prices = require("../database/collections/prices.json").map(
  p => new Price(p)
);

module.exports = {
  up(db, next) {
    DatabaseHelper.insert({
      database: db,
      collection: collection,
      docs: prices
    })
      .then(data => next())
      .catch(err => console.log(err));
    next();
  },

  down(db, next) {
    DatabaseHelper.remove({ database: db, collection: collection })
      .then(data => next())
      .catch(err => console.log(err));
    next();
  }
};
