const util = require("../util");
const Permission = require("../../models/users/PermissionModel");
const permissions = [
  { key: "users", name: "Crear Usuarios" },
  { key: "users", name: "Crear Usuarios" },
  { key: "users", name: "Crear Usuarios" },
];

module.exports = {
  migrate: () => {
    for (var i = 0; i < permissions.length; i++) {
      const permission = new Permission(permissions[i]);
      console.log("Row[%i]: %s", i, permission);
      permission.save(util.Mongo.Log);
    }
    util.Migration.Log(__filename);
  },
  rows: permissions
};
