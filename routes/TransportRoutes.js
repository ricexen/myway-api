var express = require("express");
var router = express.Router();
var TransportsController = require("../controllers/TransportController");

/**
 * GET Transports
 */
router.get('/:id', TransportsController.transport);
router.get("/list", TransportsController.list);

module.exports = router;
