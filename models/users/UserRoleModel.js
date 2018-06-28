var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const Role = require("./RoleModel");

var UserRoleSchema = new Schema({
  user: User,
  rol: {
    type: Schema.Types.ObjectId,
    ref: "Rol",
    default: Rol.findOne({ key: "user" })
  },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false }
});

module.exports = mongoose.model("UserRole", UserRoleSchema);
