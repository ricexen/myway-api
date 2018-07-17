var express = require("express");
var router = express.Router();
var PathsController = require("../controllers/PathsController");

/**
 * GET Paths
 */
router.get("/list", PathsController.paths);
router.get("/list/geojson", PathsController.pathsGeoJSON);
router.get("/:pathId/prices", PathsController.prices);
router.get('/:pathId/transport', PathsController.transport);
module.exports = router;
