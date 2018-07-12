"use strict";
const DatabaseUtil = require("../helpers/DatabaseUtil");
const Role = require("../models/users/RoleModel");
const Permission = require("../models/users/PermissionModel");
const RolePermission = require("../models/users/RolePermissionModel");

const collection = "rolepermissions";
var rolepermissions = require("../database/collections/rolepermissions.json");
var rolePermissionsToInsert = [];

module.exports = {
  up(db, next) {
    for (var i = 0; i < rolepermissions.length; i++) {
      const rp = rolepermissions[i];
      db.collection("roles").findOne({ key: rp.role }, (err, role) => {
        db.collection("permissions")
          .find({ key: { $in: rp.permissions } })
          .toArray()
          .then(permissions => {
            const rolePermission = new RolePermission({
              role: role,
              permissions: permissions
            });
            rolePermission.save();
            rolePermissionsToInsert.push(rolePermission);
            if (isArrayCompleteToInsert())
              insertRolePermissions(db, next, rolePermissionsToInsert);
          });
      });
    }
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
  }
};

var isArrayCompleteToInsert = () => {
  console.log(rolepermissions.length == rolePermissionsToInsert.length);
  return rolepermissions.length == rolePermissionsToInsert.length;
};

var insertRolePermissions = (db, next, rolepermissions) => {
  console.log(rolepermissions);
  db.collection(collection).insert(rolepermissions, (err, inserted) => {
    DatabaseUtil.upLog(err, inserted, next);
  });
};
