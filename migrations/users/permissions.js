const util = require("../util");
const Permission = require("../../models/users/PermissionModel");
const permissions = [
  // Users
  { key: "create-users", name: "Crear Usuarios" },
  { key: "read-users", name: "Ver Usuarios" },
  { key: "update-users", name: "Editar Usuarios" },
  { key: "delete-users", name: "Borrar Usuarios" },

  // Profile
  { key: "update-profile", name: "Actualizar Perfil" },
  { key: "delete-profile", name: "Borrar Perfil" },
  { key: "read-profile", name: "Ver Perfil" },
  { key: "read-profiles", name: "Ver Perfiles" },

  // Permissions
  { key: "create-permissions", name: "Crear Permisos" },
  { key: "read-permissions", name: "Ver Permisos" },
  { key: "update-permissions", name: "Editar Permisos" },
  { key: "delete-permissions", name: "Borrar Permisos" },

  // Roles
  { key: "create-roles", name: "Crear Roles" },
  { key: "read-roles", name: "Ver Roles" },
  { key: "update-roles", name: "Editar Roles" },
  { key: "delete-roles", name: "Borrar Roles" },

  // Role Permissions
  { key: "create-rolePermissions", name: "Crear RolPermisos" },
  { key: "read-rolePermissions", name: "Ver RolPermisos" },
  { key: "update-rolePermissions", name: "Editar RolPermisos" },
  { key: "delete-rolePermissions", name: "Borrar RolPermisos" },

  // Key Points
  { key: "create-keyPoints", name: "Crear Puntos Clave" },
  { key: "read-keyPoints", name: "Ver Puntos Clave" },
  { key: "update-keyPoints", name: "Editar Puntos Clave" },
  { key: "delete-keyPoints", name: "Borrar Puntos Clave" },

  // Paths
  { key: "create-paths", name: "Crear Rutas" },
  { key: "read-paths", name: "Ver Rutas" },
  { key: "update-paths", name: "Editar Rutas" },
  { key: "delete-paths", name: "Borrar Rutas" },

  // Prices
  { key: "create-prices", name: "Crear Precios" },
  { key: "read-prices", name: "Ver Precios" },
  { key: "update-prices", name: "Editar Precios" },
  { key: "delete-prices", name: "Borrar Precios" },

  // Transport
  { key: "create-transports", name: "Crear Transportes" },
  { key: "read-transports", name: "Ver Transportes" },
  { key: "update-transports", name: "Editar Transportes" },
  { key: "delete-transports", name: "Borrar Transportes" }
];

module.exports = {
  migrate: () => {
    for (var i = 0; i < permissions.length; i++) {
      const permission = new Permission(permissions[i]);
      console.log("Row[%i]: ", i);
      console.log(permission);
      permission.save(util.Mongo.Log);
    }
    util.Migration.Log(__filename);
  },
  rows: permissions
};
