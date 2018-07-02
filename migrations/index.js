var index = 0;
const migrations = [
  // require("./users/permissions"),
  // require("./users/roles"),
  require("./users/rolePermissions")
];
const migrate = () => {
  migrations.forEach(migration => {
    migration.migrate();
  });
};

module.exports = { migrations: migrations, migrate: migrate };
