require("dotenv").config();
const user = process.env.MONGO_USER,
  password = process.env.MONGO_PASSWORD,
  db = process.env.MONGO_DB,
  mongoPort = process.env.MONGO_PORT;
module.exports = {
  mongoURI: "mongodb://" + user + ":" + password + "@ds"+ mongoPort +".mlab.com:" + mongoPort + "/" + db,
  secretKey: "Bearer"
};
