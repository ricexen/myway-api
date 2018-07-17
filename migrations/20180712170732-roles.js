"use strict";
const DatabaseHelper = require("../helpers/DatabaseHelper");
const ObjectId = require("mongodb").ObjectID;
const Role = require("../models/users/RoleModel");

const collection = "roles";
const roles = require("../database/collections/roles.json").map(r => {
  const role = new Role(r);
  role.save();
  return role;
});

module.exports = {
  up(db, next) {
    DatabaseHelper.insert({
      database: db,
      collection: collection,
      docs: roles
    })
      .then(data => next())
      .catch(err => console.log(err));
  },

  down(db, next) {
    DatabaseHelper.remove({ database: db, collection: collection })
      .then(data => next())
      .catch(err => console.log(err));
  }
};
