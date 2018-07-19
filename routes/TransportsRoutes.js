var express = require("express");
var router = express.Router();
var TransportsController = require("../controllers/TransportsController");

/**
 * GET Paths
 */
router.get("/list", TransportsController.index);
module.exports = router;
