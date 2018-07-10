const Util = require("./utilHelper");
const User = require("../../models/users/UserModel");
const Role = require("../../models/users/RoleModel");
const Permission = require("../../models/users/PermissionModel");
const RolePermission = require("../../models/users/RolePermissionModel");
module.exports = {
  /**
   * Add Role to User including all the permissions in the Role
   * @param {User} user
   * @param {Role} role
   */
  addRole(user, role) {
    // find the user
    User.findOne({_id: user._id, email: user.email}).exec((err, user) => {
      // find the role
      Role.findOne({_id: role._id}).exec((err, role) => {
        // find the role-permission
        RolePermission.findOne({role:role._id}).exec((err, rolePermission) => {
          if(!rolePermission){
            
          }
        })
      })
    })
  },
  /**
   *
   * @param {User} user
   */
  isLogged(user) {
    return true;
  }
};
