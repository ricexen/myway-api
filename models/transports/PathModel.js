var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Creates a LineString Schema.
var PathSchema = new Schema({
  name: { type: String, required: true },
  line: {
    type: "LineString",
    coordinates: Array
  },
  prices: [{ type: Schema.Types.ObjectId, ref: "Price" }],
  keypoints: [{ type: Schema.Types.ObjectId, ref: "KeyPoint" }],
  color: { type: String, min: 3, max: 6, required: false }
});

module.exports = mongoose.model("path", PathSchema);
