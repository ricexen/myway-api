"use strict";
const Validation = require("../helpers/Util").Validation;
const DatabaseHelper = require("../helpers/DatabaseHelper");
const Transport = require("../models/transports/TransportModel");

const collection = "transports";
var transports = require("../database/collections/transports.json");

module.exports = {
  up(db, next) {
    TransportsMap(transports, db)
      .then(transports => {
        DatabaseHelper.insert({
          database: db,
          collection: collection,
          docs: transports
        })
          .then(data => next())
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  },

  down(db, next) {
    DatabaseHelper.remove({
      database: db,
      collection: collection
    })
      .then(data => next())
      .catch(err => console.log(err));
  }
};

var TransportsMap = (transports, db) => {
  return new Promise((resolve, reject) => {
    var tranportsMaped = [];
    for (let i = 0; i < transports.length; i++) {
      const transport = transports[i];
      TransportMap(transport, db)
        .then(transport => {
          tranportsMaped.push(transport);
          if (Validation.areSameLenght(tranportsMaped, transports))
            resolve(tranportsMaped);
        })
        .catch(err => console.log(err));
    }
  });
};

var TransportMap = (transport, db) => {
  return new Promise((resolve, reject) => {
    if (transport.paths) {
      db.collection("paths")
        .find({
          name: { $in: transport.paths.map(p => p.name) }
        })
        .toArray()
        .then(paths => {
          transport.paths = paths;
          const t = new Transport(transport);
          resolve(t);
        })
        .catch(err => reject(err));
    } else resolve(new Transport(transport));
  });
};
