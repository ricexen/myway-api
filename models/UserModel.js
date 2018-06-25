var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false },
  university: { type: String, required: false },
  birthdate: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("users", UserSchema);
