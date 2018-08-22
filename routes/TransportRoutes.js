var express = require("express");
var router = express.Router();
var TransportsController = require("../controllers/TransportController");

router.get("/list", TransportsController.list);
router.get("/:id", TransportsController.transport);
router.get("/listSearch/:commonName", TransportsController.listSearch);//ruta que consume la api

module.exports = router;
