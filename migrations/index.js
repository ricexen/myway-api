const mongoose = require("mongoose");
const keys = require("../config/keys");
const migrations = [
  // require("./users/roles"),
  // require("./users/permissions"),
  // require("./users/rolePermissions"),
  // require("./users/admins"),
  require("./inventory/categories")
];
function migrate() {
  console.log("Migrations initiated...");
  for (var i = 0; i < migrations.length; i++) {
    migrations[i].migrate();
  }
}

mongoose
  .connect(keys.MongoDB)
  .then(() => console.log("MongoDB connected"))
  .then(() => migrate())
  .catch(err => console.log());
