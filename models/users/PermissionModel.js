var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var User = require("./UserModel");

var PermissionSchema = new Schema({
  key: { type: String, required: true, max: 20, index: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  createdAt: { type: Date, required: true, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: false }
});

module.exports = mongoose.model("Permission", PermissionSchema);
