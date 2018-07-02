const Role = require("../../models/users/RoleModel");

var roles = [
    { key: "admin", name: "Administrador" },
    { key: "user", name: "Usuario" },
    { key: "publisher", name: "Publisista" }
  ],
  index = 0,
  newRole;

var migrate = () => {
  console.log("Roles[" + roles.length + "]");
  for (var i = 0; i < roles.length; i++) {
    Role.findOne(roles[i]).then(role => {
      if (role) console.log("Role already created");
      else {
        newRole = new Role(roles[index]);
        newRole.save();
        console.log("-- Role:", newRole);
      }
      index++;
    });
  }
};

module.exports = { migrate: migrate, roles: roles };
