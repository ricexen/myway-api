var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var KeypointSchema = require('mongoose').model('keypoint').schema;
//var GeoJSON = require('mongoose-geojson-schema');

//meter este Schema, arreglarlo y moverlo a su propia carpeta.
// var PathSchema = new Schema({
//     way: {type: "LineString", required: true},
//     name: {type: String, required: true},
//     transport: [Transport], //Hacer referencia al modelo de Transporte.

//   });

// Creates a LineString Schema.
var PathSchema = new Schema({
	name: { type: String, required: true },
	geo: {
		type: {
			type: String,
			default: 'LineString'
		},
		coordinates: Array
	},
	keypoints: [ KeypointSchema ], //Hacer la referencia a point, de mongodb.
	color: { type: String, min: 3, max: 6 }
});

module.exports = mongoose.model('path', PathSchema);

// const mapItemSchema = new mongoose.Schema({
//     name: String,
//     location: {
//         // It's important to define type within type field, because
//         // mongoose use "type" to identify field's object type.
//         type: {type: String, default: 'Point'},
//         // Default value is needed. Mongoose pass an empty array to
//         // array type by default, but it will fail MongoDB's pre-save
//         // validation.
//         coordinates: {type: [Number], default: [0, 0]}
//     }
// });
// const MapItem = mongoose.model('LineString', mapItemSchema);

// MapItem.create({
//     name: 'Toronto',
//     location: {
//         type: 'Point',
//         // Place longitude first, then latitude
//         coordinate: [-79.3968307, 43.6656976]
//     }
// });
