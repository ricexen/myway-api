var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// Path = require('./PathModel.js'),
// PathSchema = mongoose.model('Path').schema,
// Schema = mongoose.Schema;

var KeyPointSchema = new Schema({
  _id: String,
  name: { type: String, required: true },
  isBase: { type: Boolean, required: true, default: false },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
});

module.exports = mongoose.model("keypoint", KeypointSchema);
