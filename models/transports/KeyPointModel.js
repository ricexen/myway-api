var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var GeoPoint = require("./GeoPointSchema");

var KeyPointSchema = new Schema({
  name: { type: String, required: true },
  isBase: { type: Boolean, required: true, default: false },
  location: GeoPoint,
  image: { type: String, required: false },
  palette: [{ type: String, required: false }],
  tags: [{ type: String, ref: "Tag" }]
});

module.exports = mongoose.model("KeyPoint", KeyPointSchema);
