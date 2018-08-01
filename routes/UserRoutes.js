var express = require("express");
var router = express.Router();
var UserController = require("../controllers/UserController.js");

router.post("/register", UserController.register);
router.post("/login", UserController.login);

module.exports = router;
