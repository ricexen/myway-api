var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserPermissionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false }
});

module.exports = mongoose.model("UserPermission", UserPermissionSchema);
