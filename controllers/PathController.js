const isEmpty = require('./validation/is-empty');

const basePath = require('../models/transports/basePath');
const Path = require('../models/transports/PathModel.js');
const KeyPoint = require('../models/transports/KeyPointModel.js');
const Transport = require('../models/transports/TransportModel.js');
const Price = require('../models/transports/PriceModel.js');
const mbxDirections = require('@mapbox/mapbox-sdk/services/directions');
const directionsClient = mbxDirections({
  accessToken:
    'pk.eyJ1IjoiZGFuaWVsbWVkaW5hIiwiYSI6ImNqajYxMXFyNDBjbWUzcXN3bmk3Z2JqcjAifQ.KfFBvYL667g9_-gblXgvcw'
});
const nearestPointOnLine = require('@turf/nearest-point-on-line').default;
const distance = require('@turf/distance').default;
const turfHelpers = require('@turf/helpers');

module.exports = {
  paths(req, res) {
    Path.find().exec((err, paths) => {
      if (err) res.status(500).send(err);
      res.status(200).send(paths);
    });
  },

  prices(req, res) {
    Path.findById(req.params.pathId).exec((err, path) => {
      if (err) res.status(404).send('Ruta no encontrada');
      else {
        Price.find({ _id: { $in: path.prices } }).exec((err, prices) => {
          if (err) res.status(204).send('No se encontraron precios');
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
  },

  university(req, res) {
    KeyPoint.find({ name: req.params.name }).catch(err =>
      res.status(500).send(err)
    );
  },
  estimatedTranportArrival(req, res) {
    const userPoint = req.body.userLocation;
    const pathId = req.body.pathId;
    Path.findById(pathId).exec((err, path) => {
      if (err) {
        res.status(404).send('Path not found');
      } else {
        let shortestDistance = 0;
        let shortestPoint = [];
        let points = [];

        for (let x = 0; x < path.line.length; x++) {
          const point = [path.line[x].lon, path.line[x].lat];
          points.push(point);
        }

        let from = [];
        let to = userPoint;

        for (let i = 0; i < points.length; i++) {
          from = points[i];
          const tempDist = distance(from, to);
          if (i == 0) shortestDistance = tempDist;
          if (tempDist <= shortestDistance) {
            shortestDistance = tempDist;
            shortestPoint = points[i];
          }
        }
        const index = points.findIndex(p => p == shortestPoint);

        const userRoute = points.slice(0, index + 1);
        let directionsArray = [];
        directionsArray = [
          {
            coordinates: userRoute[0]
          },
          {
            coordinates: userRoute[userRoute.length - 1]
          }
        ];
        directionsClient
          .getDirections({
            waypoints: directionsArray,
            geometries: 'geojson',
            profile: 'driving-traffic',
            overview: 'full'
          })
          .send()
          .then(response => {
            const travelTime = response.body.routes[0].duration;
            console.log(travelTime);
            let timeInSeconds = travelTime + path.currentDeparture;
            let date = new Date();
            const currentDate =
              date.getHours() * 3600 +
              date.getMinutes() * 60 +
              date.getSeconds();

            if (currentDate > timeInSeconds) {
              while (currentDate > timeInSeconds) {
                timeInSeconds += path.departureInterval;
              }
            } else {
              while (timeInSeconds - currentDate > path.departureInterval) {
                timeInSeconds -= path.departureInterval;
              }
            }

            date.setHours(0, 0, timeInSeconds, 0);

            directionsArray = [
              {
                coordinates: userPoint
              },
              {
                coordinates: shortestPoint
              }
            ];

            directionsClient
              .getDirections({
                waypoints: directionsArray,
                geometries: 'geojson',
                profile: 'walking',
                overview: 'full'
              })
              .send()
              .then(response => {
                const points = response.body.routes[0].geometry.coordinates.map(
                  p => {
                    let obj = {};
                    obj.lon = p[0];
                    obj.lat = p[1];
                    return obj;
                  }
                );
                const mapboxPath = new Path({
                  line: points,
                  name: 'Caminar',
                  color: '000'
                });
                res.status(200).send({ date, mapboxPath });
              })
              .catch(error => {
                res.status(500).send(error);
              });
          })
          .catch(error => {
            res.status(500).send(error);
          });
      }
    });
  },
  shortestDistance(point, line) {
    let shortestDistance = 0;
    let shortestPoint = [];
    for (let i = 0; i < line.length; i++) {
      const temp = distance(point, line[i]);
      if (i == 0) shortestDistance = temp;
      if (temp <= shortestDistance) {
        shortestDistance = temp;
        shortestPoint = line[i];
      }
    }
    return shortestPoint;
  }
};
