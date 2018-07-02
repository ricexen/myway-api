var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// Path = require('./PathModel.js'),
// PathSchema = mongoose.model('Path').schema,
// Schema = mongoose.Schema;
var PathSchema = require("mongoose").model("path").schema;
//var TransportFamilySchema = require('mongoose').model('transportFamily').schema;

var TransportSchema = new Schema({
  name: { type: String, required: true },
  commonName: { type: String, required: true },
  family: { type: String, required: true },
  paths: [{ type: Schema.Types.ObjectId, ref: "Path" }]
});

module.exports = mongoose.model("transport", TransportSchema);
