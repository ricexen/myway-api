"use strict";
const Validation = require("../helpers/Util").Validation;
const DatabaseHelper = require("../helpers/DatabaseHelper");
const RolePermission = require("../models/users/RolePermissionModel");

const collection = "rolepermissions";
var rolepermissions = require("../database/collections/rolepermissions.json");

module.exports = {
  up(db, next) {
    RolePermissionToModels(rolepermissions, db)
      .then(rolepermissions => {
        DatabaseHelper.insert({
          database: db,
          collection: collection,
          docs: rolepermissions
        })
          .then(data => next())
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  },

  down(db, next) {
    DatabaseHelper.remove({ database: db, collection: collection })
      .then(data => next())
      .catch(err => console.log());
  }
};

var RolePermissionToModels = (rolepermissions, db) => {
  return new Promise((resolve, reject) => {
    var rolepermissionsMapped = [];
    for (let i = 0; i < rolepermissions.length; i++) {
      const rp = rolepermissions[i];
      RolePermissionToModel(rp.role, rp.permissions, db)
        .then(rolepermission => {
          rolepermissionsMapped.push(rolepermission);
          if (Validation.areSameLenght(rolepermissionsMapped, rolepermissions))
            resolve(rolepermissionsMapped);
        })
        .catch(err => {
          err.rolepermission = rp;
          reject(err);
        });
    }
  });
};

var RolePermissionToModel = (role, permissions, db) => {
  return new Promise((resolve, reject) => {
    db.collection("roles").findOne({ key: role }, (err, role) => {
      if (err) reject(err0);
      db.collection("permissions")
        .find({ key: { $in: permissions } })
        .toArray()
        .then(permissions => {
          const rolePermission = new RolePermission({
            role: role,
            permissions: permissions
          });
          resolve(rolePermission);
        })
        .catch(err => reject(err));
    });
  });
};
