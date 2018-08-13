var express = require("express");
var router = express.Router();
var PathsController = require("../controllers/PathController");

router.get("/list", PathsController.paths);
router.get("/:pathId/prices", PathsController.prices);
router.get("/:pathId/transport", PathsController.transport);
router.get("/universities", PathsController.universities);
router.get("/list/university/:name", PathsController.university);
router.post("/estimatedtransportarrival", PathsController.estimatedTranportArrival);

module.exports = router;
