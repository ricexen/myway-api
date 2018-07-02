const Util = require("../util");
const Role = require("../../models/users/RoleModel");

const roles = [
  { key: "admin", name: "Administrador" },
  { key: "user", name: "Usuario" },
  { key: "publisher", name: "Publicador de rutas" }
];

module.exports = {
  migrate: () => {
    for (var i = 0; i < roles.length; i++) {
      const role = new Role(roles[i]);
      console.log("Row:[%i]:", i);
      console.log(role);
      role.save(Util.Mongo.Log);
    }
  },
  rows: roles
};
