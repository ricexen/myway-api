var express = require("express");
var router = express.Router();
var TransportsController = require("../controllers/TransportController");

/**
 * GET Transports
 */
router.get("/list", TransportsController.list);
router.get('/:id', TransportsController.transport);

module.exports = router;
