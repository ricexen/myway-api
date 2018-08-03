const isEmpty = require("./validation/is-empty");

const Path = require("../models/transports/PathModel.js");
const KeyPoint = require("../models/transports/KeyPointModel.js");
const Transport = require("../models/transports/TransportModel.js");
const Price = require("../models/transports/PriceModel.js");
const mbxDirections = require('@mapbox/mapbox-sdk/services/directions');
const directionsClient = mbxDirections({
  accessToken: 'pk.eyJ1IjoiZGFuaWVsbWVkaW5hIiwiYSI6ImNqajYxMXFyNDBjbWUzcXN3bmk3Z2JqcjAifQ.KfFBvYL667g9_-gblXgvcw'
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
      if (err) res.status(404).send("Path not found");
      else {
        Price.find({ _id: { $in: path.prices } }).exec((err, prices) => {
          if (err) res.status(204).send("No Prices found");
          else res.status(200).send(prices);
        });
      }
    });
  },

  transport(req, res) {
    Transport.find({ paths: req.params.pathId }, (err, transports) => {
      if (err) res.status(500).send(err);
      else if (!transports)
        res.status(500).send({ message: "No transport found" });
      else res.status(200).send(transports[0]);
    });
  },

  universities(req, res) {
    KeyPoint.find({ tags: "university" })
      .catch(err => res.status(500).send(err))
      .then(keypoints => {
        if (keypoints.length == 0)
          res.status(404).send({ result: { message: "No keypoints found" } });
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
    KeyPoint.findOne({ name: userUniversity }, "_id name")
      .catch(err => res.status(500).send(err))
      .then(university => {
        if (isEmpty(university))
          res
            .status(404)
            .send({ result: { message: "User University not found" } });
        else {
          const universityId = university._id;

          Path.find()
            .then(paths => {
              if (isEmpty(paths)) {
                res.status(404).send({ result: { message: "No paths found" } });
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
    Path.findById(req.pathId).exec((err, path) => {
      if(err){ 
        res.status(404).send("Path not found");
      }
      else{
        
      }
    });
    directionsClient.getDirections({
      waypoints: [
        {
          coordinates: [-117.12008, 32.527522]
        },
        {
          coordinates: [-117.040174, 32.534628]
        }
      ],
      geometries: 'geojson',
      profile: 'driving',
      overview: 'full'
    })
    .send()
    .then(response => {
      const route = response.body;
      res.status(200).send(route);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  },
  shortestDistance(line, point) {
    let shortestDistance = 0;
    let shortestPoint = [];
    for (let i = 0; i < line.length; i++) {
      const temp = distance(point, line[i]);
      if(temp < shortestDistance){
        shortestDistance = temp;
        shortestPoint = line[i];
      }
    }
    return shortestPoint;
  }
};
