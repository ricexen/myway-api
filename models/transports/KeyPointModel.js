var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var KeyPointSchema = new Schema({
  name: { type: String, required: true },
  isBase: { type: Boolean, required: true, default: false },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
});

module.exports = mongoose.model("keypoint", KeypointSchema);
