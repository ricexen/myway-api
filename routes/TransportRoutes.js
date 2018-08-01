var express = require("express");
var router = express.Router();
var TransportsController = require("../controllers/TransportController");

router.get("/list", TransportsController.list);
router.get("/:id", TransportsController.transport);

module.exports = router;
