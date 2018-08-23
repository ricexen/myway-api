var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GeoPointSchema = new Schema(
  {
    lat: { type: Number , min: -90, max: 90 },
    lon: { type: Number , min: -180, max: 180 },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

module.exports = GeoPointSchema;
