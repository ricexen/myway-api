var env = require("dotenv").config().parsed;
const mongoDBURI = env.MONGO_URI;
module.exports = {
  mongoURI: mongoDBURI,
  secretKey: "Bearer"
};
