"use strict";
const DatabaseUtil = require("../helpers/DatabaseUtil");
const Permission = require("../models/users/PermissionModel");

var collection = "permissions";
var permissions = require("../database/collections/permissions.json");

module.exports = {
  up(db, next) {
    permissions = permissions.map(p => {
      const permission = new Permission(p);
      permission.save();
      return permission;
    });
    db.collection(collection).insert(permissions, (err, inserted) => {
      if (err) console.log(err);
      else {
        DatabaseUtil.writeIdentifiers(inserted.ops, { filename: collection })
          .then(data => {
            next();
          })
          .catch(err => console.log(err));
      }
    });
  },

  down(db, next) {
    DatabaseUtil.identifiersFromJsonFile(collection).then(ids => {
      db.collection(collection).remove(
        {
          _id: {$in: ids}
        },
        (err, removed) => {
          DatabaseUtil.downLog(err, removed, next)
        }
      );
    });
  }
};
