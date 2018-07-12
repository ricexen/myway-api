"use strict";
const DatabaseUtil = require("../helpers/DatabaseUtil");
const ObjectId = require("mongodb").ObjectID;
const Role = require("../models/users/RoleModel");

var roles = require("../database/collections/roles.json"),
  collection = "roles";

module.exports = {
  up(db, next) {
    roles = roles.map(r => {
      const role = new Role(r);
      role.save();
      return role;
    });
    db.collection(collection).insert(roles, (err, inserted) => {
      if (err) console.log(err);
      else {
        DatabaseUtil.writeIdentifiers(inserted.ops, {
          filename: collection
        })
          .then(data => {
            DatabaseUtil.upLog(err, inserted, next);
          })
          .catch(err => console.log(err));
      }
    });
  },

  down(db, next) {
    DatabaseUtil.identifiersFromJsonFile(collection).then(ids => {
      db.collection(collection).remove(
        { _id: { $in: ids } },
        (err, removed) => {
          DatabaseUtil.downLog(err, removed, next);
        }
      );
    });
    next();
  }
};
