const modelsDir = "../../models/";
const Util = require("../util");
const Role = require(modelsDir + "users/RoleModel");
const Permission = require(modelsDir + "users/PermissionModel");
const RolePermission = require(modelsDir + "users/RolePermissionModel");

module.exports = {
  migrate() {
    Role.findOne({ key: "admin" }).exec((err, role) => {
      Permission.find().exec((err, permissions) => {
        const rolePermission = new RolePermission({
          role: role,
          permissions: permissions
        });
        rolePermission.save(Util.Mongo.Log);
        console.log(rolePermission);
      });
      Util.Migration.Log(__filename);
    });
  }
};
