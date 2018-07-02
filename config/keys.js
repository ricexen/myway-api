require("dotenv").config();
const user = process.env.MONGO_USER,
  password = process.env.MONGO_PASSWORD,
  db = process.env.MONGO_DB;
module.exports = {
  mongoURI: "mongodb://" + user + ":" + password + ".mlab.com:15971/" + db,
  secretKey: "Bearer"
};
