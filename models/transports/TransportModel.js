var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Path = require('./PathModel.js'),
// PathSchema = mongoose.model('Path').schema,
// Schema = mongoose.Schema;
var PathSchema = require('mongoose').model('path').schema;
//var TransportFamilySchema = require('mongoose').model('transportFamily').schema;

var TransportSchema = new Schema({
	name: { type: String, required: true },
	commonName: { type: String, required: true },
	currency: { type: String, required: true },
	prices: {
		dayRate: {
			rateNormal: { type: Number, required: true },
			rateStudent: { type: Number },
			startTime: { type: Date, required: true },
			endTime: { type: Date, required: true }
		},
		nightRate: {
			rateNormal: { type: Number, required: true },
			rateStudent: { type: Number },
			startTime: { type: Date, required: true },
			endTime: { type: Date, required: true }
		}
	},
	family: { type: String, required: true },
	locations: [ PathSchema ]
});

module.exports = mongoose.model('transport', TransportSchema);
