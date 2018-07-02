var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RolePermissionSchema = new Schema({
  role: { type: Schema.Types.ObjectId, ref: "Rol" },
  permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false }
});

module.exports = mongoose.model("RolePermission", RolePermissionSchema);
