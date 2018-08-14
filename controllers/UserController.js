var User = require("../models/users/UserModel.js");
const validateRegisterInput = require("./validation/register");
const validateLoginInput = require("./validation/login");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

/**
 * UserController.js
 *
 * @description :: Server-side logic for managing Users.
 */
module.exports = {
  /**
   * UserController.register()
   * @param {Request} req
   * @param {Response} res
   */
  register(req, res) {
    const { errors, isValid } = validateRegisterInput(req.body); //validate
    if (!isValid) {
      return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
      if (user) return res.status(400).json({ email: "Email already exist" });
      else {
        const avatar = gravatar.url(req.body.email, {
          s: 200, // size
          r: "pg", // Rating
          d: "mm" // Default
        });
        const newUser = new User({
          _id: req.body._id,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: req.body.password,
          avatar,
          university: req.body.university,
          birthdate: req.body.birthdate
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) res.status(400).json({ email: "password error" });
            else {
              newUser.password = hash;
              newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            }
          });
        });
      }
    });
  },
  /**
   * UserController.login()
   * @param {Request} req
   * @param {Response} res
   */
  login(req, res) {
    const { errors, isValid } = validateLoginInput(req.body); //validate
    if (!isValid) return res.status(400).json(errors);

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email }).then(userLog => {
      // Check for user
      if (!userLog) {
        errors.email = "User not found";
        return res.status(404).json(errors);
      }
      else {
        console.log(userLog)
        return res.status(200).send(userLog);
      }
      // Check password match
      bcrypt.compare(password, userLog.password).then(isMatch => {
        if (isMatch) {
          const payload = {
            firstname: userLog.firstname,
            lastname: userLog.lastname,
            avatar: userLog.avatar,
            university: userLog.university,
            birthdate: userLog.birthdate
          };
          jwt.sign(
            payload,
            keys.secretKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: "Success Login",
                token: "Bearer " + token
              });
            }
          );
        } else {
          errors.password = "Failure Login";
          return res.status(404).json(errors);
        }
      });
    });
  },

  edit(req, res) {
    var editUser = {
      _id: req.body._id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
     // email: req.body.email,
      university: req.body.university
    }
    User.updateOne({"_id": req.body._id}, {$set: editUser}, function(err){
      if(err){
        return res.send({
          message: "Error"
        });
      }else{
        return res.send({
          message: "Editado exitosamente"  
        });
        
      }
    })
  },
  

};
