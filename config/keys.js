require("dotenv").config();
const mongoDBURI = process.env.MONGO_URI;
module.exports = {
  mongoURI: mongoDBURI,
  secretKey: "Bearer"
};
