var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PathSchema = new Schema({
  name: { type: String, required: true },
  line: [{ lat: Number, lon: Number }],
  prices: [{ type: Schema.Types.ObjectId, ref: "Price" }],
  keypoints: [{ type: Schema.Types.ObjectId, ref: "KeyPoint" }],
  color: { type: String, min: 3, max: 6, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("path", PathSchema);
