var express = require("express");
var router = express.Router();
var PathsController = require("../controllers/PathsController");

/**
 * GET Paths
 */
router.get("/list", PathsController.paths);
router.get("/list/geojson", PathsController.pathsGeoJSON);
module.exports = router;
