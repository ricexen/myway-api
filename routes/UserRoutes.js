var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');

/*
 * POST
 */
router.post('/register', UserController.register)
/*
 * POST
 */
router.post('/login', UserController.login)
module.exports = router;
