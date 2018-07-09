require("dotenv").config();
const user = (mongoDBURI = process.env.MONGO_URI);
module.exports = {
  mongoURI: mongoDBURI,
  secretKey: "Bearer"
};
