var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var GeoPoint = require("./GeoPointSchema");
var basePath = require("./basePath");

var PathSchema = new Schema(
  {
    name: { type: String, required: true },
    line: [GeoPoint],
    prices: [{ type: String, ref: "Price" }],
    keypoints: [{ type: Schema.ObjectId, ref: "KeyPoint" }],
    color: { type: String, min: 3, max: 6, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

PathSchema.virtual("geojson").get(function() {
  var coords = [];
  for (var j = 0; j < this.line.length; j++) {
    coords.push([this.line[j].lon, this.line[j].lat]);
  }
  var geojson = JSON.parse(JSON.stringify(basePath));
  geojson.features[0].properties.name = this.name;
  geojson.features[0].geometry.coordinates = coords;
  return geojson;
});

PathSchema.virtual('mapMatchings').get(function(){
  var point = {};
  var points = [];
  for (var i = 0; i < this.line.length; i++) {
    const geoPoint = this.line[i];
    point.coordinates = [geoPoint.lon, geoPoint.lat];
    point.approach = "curb";
    points.push(point);
  }
  return points;
})

module.exports = mongoose.model("Path", PathSchema);
