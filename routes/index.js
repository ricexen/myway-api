var express = require("express");
var router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/register", (req, res) => {
  res.render("form/register", { title: "Register" });
});

router.get("/login", (req, res) => {
  res.render("form/login");
});

module.exports = router;
