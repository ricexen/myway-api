require("dotenv").config();
const Util = require("../util.js");
const User = require("../../models/users/UserModel");
const admins = process.env.ADMINS.split(",");
module.exports = {
  migrate() {
    for (var i = 0; i < admins.length; i++) {}
  }
};
