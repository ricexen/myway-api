var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PriceSchema = new Schema({
	name: {type: String, default: 'normal'},
  currency: { type: String, required: true, default: "MXN", max: 3 },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
});

module.exports = mongoose.model("Price", PriceSchema);
