var express = require('express');
var router = express.Router();
var PathsController = require('../controllers/PathController');
const passport = require('passport');

/**
 * GET Paths
 */
router.get('/list', PathsController.paths);
router.get('/list/geojson', PathsController.pathsGeoJSON);
router.get('/:pathId/prices', PathsController.prices);
router.get('/:pathId/transport', PathsController.transport);
router.get('/universities', PathsController.universities);
router.get(
  '/useruniroutes',
  passport.authenticate('jwt', { session: false }),
  PathsController.userUniversityPaths
);

module.exports = router;
