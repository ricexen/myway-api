const isEmpty = require('./validation/is-empty');

const Validation = require('../helpers/Util').Validation;
const Path = require('../models/transports/PathModel.js');
const KeyPoint = require('../models/transports/KeyPointModel.js');
const Transport = require('../models/transports/TransportModel.js');
const Price = require('../models/transports/PriceModel.js');
const basePath = require('./basePath.js');

module.exports = {
  paths(req, res) {
    Path.find().exec((err, paths) => {
      if (err) res.status(500).send(err);
      res.send(paths);
    });
  },
  prices(req, res) {
    Path.findById(req.params.pathId).exec((err, path) => {
      if (err) res.status(404).send('Path not found');
      else {
        Price.find({ _id: { $in: path.prices } }).exec((err, prices) => {
          if (err) res.status(204).send('No Prices found');
          else res.status(200).send(prices);
        });
      }
    });
  },
  transport(req, res) {
    Transport.find({ paths: req.params.pathId }, (err, transports) => {
      if (err) res.status(500).send(err);
      else if (!transports)
        res.status(500).send({ message: 'No transport found' });
      else res.status(200).send(transports[0]);
    });
  },

  pathsGeoJSON(req, res) {
    var pathArr = [];
    Path.find().exec((err, paths) => {
      for (let index = 0; index < paths.length; index++) {
        const path = paths[index];
        var coords = [];
        for (var j = 0; j < path.line.length; j++) {
          coords.push([path.line[j].lon, path.line[j].lat]);
        }
        var geojson = JSON.parse(JSON.stringify(basePath));
        geojson.features[0].geometry.coordinates = coords;

        pathArr.push(geojson);
      }
      if (err) res.status(500).send(err);
      res.send(pathArr);
    });
  },
  universities(req, res) {
    KeyPoint.find({ tags: 'university' })
      .catch(err => res.status(500).send(err))
      .then(keypoints => {
        if (keypoints.length == 0)
          res.status(404).send({ result: { message: 'No keypoints found' } });
        else {
          var keypointIds = keypoints.map(keypoint => String(keypoint._id));
          Path.find()
            .then(docs => {
              var paths = [];
              for (var i = 0; i < docs.length; i++) {
                const doc = docs[i];
                for (var j = 0; j < keypointIds.length; j++) {
                  const id = keypointIds[j];
                  if (doc.keypoints.map(kp => String(kp)).includes(id))
                    paths.push(doc);
                }
              }
              res.status(200).send(paths);
            })
            .catch(err => res.status(500).send(err));
        }
      });
  },
  userUniversityPaths(req, res) {
    const userUniversity = req.user.university;
    KeyPoint.findOne({ name: userUniversity }, '_id name')
      .catch(err => res.status(500).send(err))
      .then(university => {
        if (isEmpty(university))
          res
            .status(404)
            .send({ result: { message: 'User University not found' } });
        else {
          const universityId = university._id;

          Path.find()
            .then(paths => {
              if (isEmpty(paths)) {
                res.status(404).send({ result: { message: 'No paths found' } });
              } else {
                var universityPaths = [];
                for (let i = 0; i < paths.length; i++) {
                  const path = paths[i];
                  const keypoints = path.keypoints;
                  if (!isEmpty(keypoints)) {
                    for (let j = 0; j < keypoints.length; j++) {
                      const keypoint = keypoints[j];
                      if (keypoint.equals(universityId)) {
                        universityPaths.push(path);
                        break;
                      }
                    }
                  }
                }
                res.status(200).send(universityPaths);
              }
            })
            .catch(err => res.status(500).send(err));
        }
      });
  }
};