var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const User = require("./UserModel");

var RoleSchema = new Schema({
  key: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  createAt: { type: Date, required: true, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: false }
});

module.exports = mongoose.model("Role", RoleSchema);
