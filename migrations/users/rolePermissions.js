const Util = require("../util");
const Role = require("../../models/users/RoleModel");
const Permission = require("../../models/users/PermissionModel");
const RolePermission = require("../../models/users/RolePermissionModel");

var userPermissions = [
    "read-keyPoints",
    "read-prices",
    "read-transports",
    "read-paths",
    "update-profile",
    "delete-profile",
    "read-profile",
    "read-profiles"
  ],
  publisherPermissions = [
    "update-profile",
    "delete-profile",
    "read-profile",
    "read-profiles",
    "create-paths",
    "read-paths",
    "update-paths",
    "delete-paths",
    "create-transports",
    "read-transports",
    "update-transports",
    "delete-transports",
    "create-prices",
    "read-prices",
    "update-prices",
    "delete-prices",
    "create-keyPoints",
    "read-keyPoints",
    "update-keyPoints",
    "delete-keyPoints"
  ];

module.exports = {
  migrate() {
    Role.findOne({ key: "admin" }).exec((err, role) => {
      if (role) {
        Permission.find().exec((err, permissions) => {
          const rolePermission = new RolePermission({
            role: role,
            permissions: permissions
          });
          rolePermission.save(Util.Mongo.Log);
          console.log(rolePermission);
        });
      }
    });
    Role.findOne({ key: "user" }).exec((err, role) => {
      if (role) {
        Permission.find({ key: { $in: userPermissions } }).exec(
          (err, permissions) => {
            const rolePermission = new RolePermission({
              role: role,
              permissions: permissions
            });
            rolePermission.save(Util.Mongo.Log);
            console.log(rolePermission);
          }
        );
      }
    });
    Role.findOne({ key: "publisher" }).exec((err, role) => {
      Permissions.find({ key: { $in: publisherPermissions } }).exec(
        (err, permissions) => {
          const rolePermission = new RolePermission({
            role: role,
            permissions: permissions
          });
          rolePermission.save(Util.Mongo.Log);
          console.log(rolePermission);
        }
      );
    });
    Util.Migration.Log(__filename);
  }
};
