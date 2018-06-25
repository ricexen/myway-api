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

/*
 * GET
 */
router.get('/', UserController.list);

/*
 * GET
 */
router.get('/:id', UserController.show);

/*
 * POST
 */
router.post('/', UserController.create);

/*
 * PUT
 */
router.put('/:id', UserController.update);

/*
 * DELETE
 */
router.delete('/:id', UserController.remove);

module.exports = router;
