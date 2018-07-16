var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PriceSchema = new Schema({
  _id: { type: String, default: "normal" },
  value: { type: Number, default: 0 },
  currency: { type: String, required: true, default: "MXN", max: 3 },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
});

module.exports = mongoose.model("Price", PriceSchema);
