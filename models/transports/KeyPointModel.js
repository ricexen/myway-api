var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var GeoPoint = require("./GeoPointSchema");

var KeyPointSchema = new Schema({
  name: { type: String, required: true },
  isBase: { type: Boolean, required: true, default: false },
  location: { GeoPoint }
});

module.exports = mongoose.model("keypoint", KeyPointSchema);
