var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GeoPoint = require('./GeoPointSchema');
var basePath = require('./basePath');
var PathHelper = require('../../helpers/PathsHelper');
//var Pathsss = require('../../controllers/PathController');
//const keys = require('../../Configuration/keys');

const mbxMapMatching = require('@mapbox/mapbox-sdk/services/map-matching');
const mapMatchingClient = mbxMapMatching({
	accessToken: 'pk.eyJ1IjoiY2FybGFwZXJleiIsImEiOiJjamwyanc3eXMwMGFnM3dxZTdncTFobHJ0In0.3wKa1yFQJGH60nuwAzjuxQ'
});
console.log('hola');
var PathSchema = new Schema(
	{
		name: { type: String, required: true },
		line: [ GeoPoint ],
		fixedLine : [ GeoPoint ],
		prices: [ { type: String, ref: 'Price' } ],
		keypoints: [ { type: Schema.ObjectId, ref: 'KeyPoint' } ],
		color: { type: String, min: 3, max: 6, required: false },
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now }
	},
	{ toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
// var mapMatch = function(coords) {};

// PathSchema.virtual('lineString').get(function() {
// 	var coords = [];
// 	var points = [];
// 	var fullCoords = [];
// 	var geoPoint;
// 	var groups = [];
// 	var matchingCoords = [];
// 	for (var j = 0; j < this.line.length; j++) {
// 		coords.push([ this.line[j].lon, this.line[j].lat ]);
// 	}

// 	for (var i = 0; i < this.line.length; i++) {
// 		var point = {};
// 		geoPoint = this.line[i];
// 		// console.log(this.line[i]);
// 		point.coordinates = [ geoPoint.lon, geoPoint.lat ];
// 		point.approach = 'curb';
// 		points.push(point);
// 		//console.log(points[i]);

// 		// console.log(point.coordinates);
//   }
// //   console.log("WHAT WHAT IN THE BATT");
// // ///console.log(Path);
// //   //var coords = Path.lineString;
// //   console.log("fuck coords");
// // 	console.log(coords);
// 	//console.log(coords);
// 	var lineString = JSON.parse(JSON.stringify(basePath));
// 	lineString.features[0].properties.name = this.name;
// 	lineString.features[0].geometry.coordinates = this.lineString.features[0].geometry;
// 	//console.log(lineString.length);
// 	return lineString;
// });



// PathSchema.virtual('coordPoints').get(function() {
// 	var points = [];
// 	var fullCoords = [];
// 	var geoPoint;
// 	for (var i = 0; i < this.line.length; i++) {
// 		var point = {};
// 		geoPoint = this.line[i];
// 		point.coordinates = [ geoPoint.lon, geoPoint.lat ];
// 		point.approach = 'curb';
// 		points.push(point);
// 	}

// 	return points;
// });
PathSchema.virtual('geojson').get(function() {
	var coords = [];
	for (var j = 0; j < this.fixedLine.length; j++) {
		coords.push([ this.fixedLine[j].lon, this.fixedLine[j].lat ]);
	}

	var geojson = JSON.parse(JSON.stringify(basePath));
	geojson.features[0].properties.name = this.name;
	geojson.features[0].geometry.coordinates = coords;
	//console.log(geojson.length);
	//console.log(	geojson.features[0].geometry.coordinates);
	return geojson;
});

PathSchema.virtual('matchPoints').get(function() {
	var points = [];
	for (var i = 0; i < this.line.length; i++) {
		var point = {};
		const geoPoint = this.line[i];
		// console.log(geoPoint.lon);
		point.coordinates = [ geoPoint.lon, geoPoint.lat ];
		// console.log("THIS IS COORDINATES one", point.coordinates[0]);
		// console.log("THIS IS COORDINATES twoooo", point.coordinates[1]);
		point.approach = 'curb';
		// console.log(point);
		points.push(point);
	}
	// console.log("SE REPETIRAN ESTAS PiNCheS MADresS!_!_:!:!");
	// console.log(points[0]);
	// console.log(points[1]);
	// console.log(points[2]);

	// console.log(points[0]);
	return points;
});

module.exports = mongoose.model('Path', PathSchema);
