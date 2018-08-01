var express = require("express");
var router = express.Router();
var UserController = require("../controllers/UserController.js");
const passport = require("passport");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get(
  "/university/paths",
  passport.authenticate("jwt", { session: false }),
  UserController.universityPaths
);

module.exports = router;
