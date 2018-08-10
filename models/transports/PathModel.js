var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GeoPoint = require('./GeoPointSchema');
var basePath = require('./basePath');

var PathSchema = new Schema(
  {
    name: { type: String, required: true },
    line: [GeoPoint],
    prices: [{ type: String, ref: 'Price' }],
    keypoints: [{ type: Schema.ObjectId, ref: 'KeyPoint' }],
    color: { type: String, min: 3, max: 6, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    firstDeparture: { type: Number },
    lastDeparture: { type: Number },
    departureInterval: { type: Number }
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

PathSchema.virtual('geojson').get(function() {
  var coords = [];
  for (var j = 0; j < this.line.length; j++) {
    coords.push([this.line[j].lon, this.line[j].lat]);
  }
  var geojson = JSON.parse(JSON.stringify(basePath));
  geojson.features[0].properties.name = this.name;
  geojson.features[0].geometry.coordinates = coords;
  return geojson;
});
PathSchema.virtual('currentDeparture').get(function() {
  let date = new Date();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const currentDate = hours * 3600 + minutes * 60;
  let currentDeparture = this.firstDeparture;

  for (
    let x = this.firstDeparture;
    x <= currentDate;
    x += this.departureInterval
  ) {
    if (x >= currentDate - this.departureInterval) {
      currentDeparture = x;
    }
  }
  return currentDeparture;
});

module.exports = mongoose.model('Path', PathSchema);
