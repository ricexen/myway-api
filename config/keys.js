require("dotenv").config();
const user = process.env.MONGO_USER,
  password = process.env.MONGO_PASSWORD,
  db = process.env.MONGO_DB,
  mongoPort = process.env.MONGO_PORT,
  server = process.env.MONGO_SERVER; 
module.exports = {
  mongoURI: "mongodb://" + user + ":" + password + "@" + server + ":" + mongoPort + "/" + db,
  secretKey: "Bearer"
};
