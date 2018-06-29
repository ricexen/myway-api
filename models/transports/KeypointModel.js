var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Path = require('./PathModel.js'),
// PathSchema = mongoose.model('Path').schema,
// Schema = mongoose.Schema;

var KeypointSchema = new Schema({
	name: { type: String, required: true },
	isBase: Boolean,
	geo: {
		type: {
			type: String,
			default: 'Point'
		},
		coordinates: Array
	}
});

module.exports = mongoose.model('keypoint', KeypointSchema);
