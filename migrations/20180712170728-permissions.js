"use strict";
const DatabaseHelper = require("../helpers/DatabaseHelper");
const Permission = require("../models/users/PermissionModel");

var collection = "permissions";
var permissions = require("../database/collections/permissions.json").map(p => {
  const permission = new Permission(p);
  permission.save();
  return permission;
});

module.exports = {
  up(db, next) {
    DatabaseHelper.insert({
      database: db,
      collection: collection,
      docs: permissions
    })
      .then(data => {
        next();
      })
      .catch(err => console.log(err));
  },

  down(db, next) {
    DatabaseHelper.remove({
      database: db,
      collection: collection
    })
      .then(data => {
        next();
      })
      .catch(err => console.log(err));
  }
};
