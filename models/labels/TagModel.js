var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TagSchema = new Schema({
  _id: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Tag", TagSchema);
