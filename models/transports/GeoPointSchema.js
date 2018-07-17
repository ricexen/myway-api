var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GeoPointSchema = new Schema(
  {
    lat: Number,
    lon: Number
  },
  { _id: false }
);

module.exports = GeoPointSchema;
