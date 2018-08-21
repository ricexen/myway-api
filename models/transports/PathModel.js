var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GeoPoint = require('./GeoPointSchema');
var basePath = require('./basePath');
var PathHelper = require('../../helpers/PathsHelper');

const mbxMapMatching = require('@mapbox/mapbox-sdk/services/map-matching');
const mapMatchingClient = mbxMapMatching({
	accessToken: 'pk.eyJ1IjoiY2FybGFwZXJleiIsImEiOiJjamwyanc3eXMwMGFnM3dxZTdncTFobHJ0In0.3wKa1yFQJGH60nuwAzjuxQ'
});

var PathSchema = new Schema(
	{
		name: { type: String, required: true },
		line: [ GeoPoint ],
		fixedLine: [ GeoPoint ],
		prices: [ { type: String, ref: 'Price' } ],
		keypoints: [ { type: Schema.ObjectId, ref: 'KeyPoint' } ],
		color: { type: String, min: 3, max: 6, required: false },
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now }
	},
	{ toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

PathSchema.virtual('geojson').get(function() {
	var coords = [];
	for (var j = 0; j < this.fixedLine.length; j++) {
		coords.push([ this.fixedLine[j].lon, this.fixedLine[j].lat ]);
	}

	var geojson = JSON.parse(JSON.stringify(basePath));
	geojson.features[0].properties.name = this.name;
	geojson.features[0].geometry.coordinates = coords;
	return geojson;
});

PathSchema.virtual('geojsonOriginal').get(function() {
	var coords = [];
	for (var j = 0; j < this.line.length; j++) {
		coords.push([ this.line[j].lon, this.line[j].lat ]);
	}

	var geojson = JSON.parse(JSON.stringify(basePath));
	geojson.features[0].properties.name = this.name;
	geojson.features[0].geometry.coordinates = coords;
	return geojson;
});

PathSchema.virtual('matchPoints').get(function() {
	var points = [];
	for (var i = 0; i < this.line.length; i++) {
		var point = {};
		const geoPoint = this.line[i];
		point.coordinates = [ geoPoint.lon, geoPoint.lat ];
		point.approach = 'curb';
		points.push(point);
	}

	return points;
});

module.exports = mongoose.model('Path', PathSchema);
