const Permission = require("../../models/users/PermissionModel");

var index = 0,
  newPermission;

const permissions = [
  { key: "create-users", name: "Crear Usuarios" },
  { key: "create-permissions", name: "Crear Permisos" },
  { key: "create-roles", name: "Crear Roles" },
  { key: "create-routes", name: "Crear Rutas" },
  { key: "create-transports", name: "Crear Transportes" },
  { key: "read-users", name: "Ver Usuarios" },
  { key: "read-permissions", name: "Ver Permisos" },
  { key: "read-roles", name: "Ver Roles" },
  { key: "read-routes", name: "Ver Rutas" },
  { key: "read-transports", name: "Ver Transportes" },
  { key: "update-users", name: "Actualizar Usuarios" },
  { key: "update-permissions", name: "Actualizar Permisos" },
  { key: "update-roles", name: "Actualizar Roles" },
  { key: "update-routes", name: "Actualizar Rutas" },
  { key: "update-transports", name: "Actualizar Transportes" },
  { key: "delete-users", name: "Borrar Usuarios" },
  { key: "delete-permissions", name: "Borrar Permisos" },
  { key: "delete-roles", name: "Borrar Roles" },
  { key: "delete-routes", name: "Borrar Rutas" },
  { key: "delete-transports", name: "Borrar Transportes" }
];

var migrate = () => {
  console.log("Permissions[" + permissions.length + "]");
  for (i = 0; i < permissions.length; i++) {
    Permission.findOne({ key: permissions[i].key }).then(permission => {
      if (permission) console.log("Permission already created");
      else {
        newPermission = new Permission(permissions[index]);
        newPermission.save();
        console.log("-- Permission:", newPermission);
      }
      index++;
    });
  }
};

module.exports = { migrate: migrate, permissions: permissions };
