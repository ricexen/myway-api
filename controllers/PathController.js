const Path = require("../models/transports/PathModel.js");
const KeyPoint = require("../models/transports/KeyPointModel.js");
const Transport = require("../models/transports/TransportModel.js");
const Price = require("../models/transports/PriceModel.js");

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

  university(req, res) {
    KeyPoint.find({ name: req.params.name }).catch(err =>
      res.status(500).send(err)
    );
  }
};
