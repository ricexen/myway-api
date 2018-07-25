var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TransportSchema = new Schema({
  _id: { type: String, required: true },
  commonName: { type: String, required: true },
  family: { type: String, required: true },
  paths: [{ type: Schema.Types.ObjectId, ref: "Path" }]
});

module.exports = mongoose.model("Transport", TransportSchema);
