var express = require("express");
var router = express.Router();
var KeyPointController = require("../controllers/KeyPointController");

router.get("/list", KeyPointController.list);

module.exports = router;
