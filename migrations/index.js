const mongoose = require("mongoose");
const keys = require("../config/keys");
const migrations = [
  require("./users/roles"),
  require("./users/permissions"),
  require("./users/rolePermissions"),
  require("./users/admins")
];

console.log(keys.mongoURI);

mongoose
  .connect(keys.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .then(() => {
    for (var i = 0; i < migrations.length; i++) {
      migrations[i].migrate();
    }
  })
  .catch(err => console.log(err));
