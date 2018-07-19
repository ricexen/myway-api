var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var GeoPoint = require("./GeoPointSchema");

var PathSchema = new Schema({
  name: { type: String, required: true },
  line: [GeoPoint],
  prices: [{ type: String, ref: "Price" }],
  keypoints: [{ type: Schema.ObjectId, ref: "KeyPoint" }],
  color: { type: String, min: 3, max: 6, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("path", PathSchema);
