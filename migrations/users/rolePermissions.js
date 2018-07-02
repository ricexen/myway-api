var RolePermission = require("../../models/users/RolePermissionModel");
var Role = require("../../models/users/RoleModel");
var Permission = require("../../models/users/PermissionModel");

const migrate = () => {};

console.log("Creating RolePermissions ---");

var role, permissions;

console.log("Creating permissions for admin role ---");
Role.findOne({ key: "admin" }).exec((err, role) => {
  RolePermission.findOne({ role: role._id }).exec((err, rolePermission) => {
    if (!rolePermission) {
      Permission.find().exec((err, permissions) => {
        var rolePermission = new RolePermission({
          role: role,
          permissions: permissions
        });
        rolePermission.save();
        console.log(rolePermission);
      });
    }
  });
});
console.log("Creating permissions for user role ---");
Role.findOne({ key: "user" }).exec((err, role) => {
  RolePermission.findOne({ role: role._id }).exec((err, rolePermission) => {
    if (!rolePermission) {
      Permission.find({ key: ["read-routes", "read-transports"] }).exec(
        (err, permissions) => {
          var rolePermission = new RolePermission({
            role: role,
            permissions: permissions
          });
          rolePermission.save();
          console.log(rolePermission);
        }
      );
    }
  });
});

module.exports = { migrate: migrate };
