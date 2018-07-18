const Path = require("../models/transports/PathModel.js");
const Transport = require("../models/transports/TransportModel.js");
const Price = require("../models/transports/PriceModel.js");
module.exports = {
  paths(req, res) {
    Path.find().exec((err, paths) => {
      if (err) res.status(500).send(err);
      res.send(paths);
    });
  },
  prices(req, res) {
    Path.findById(req.params.pathId).exec((err, path) => {
      if (err) res.status(404).send("Path not found");
      else {
        Price.find({ _id: { $in: path.prices.map(price => price._id) } }).exec(
          (err, prices) => {
            if (err) res.status(204).send("No Prices found");
            else res.status(200).send(prices);
          }
        );
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
  }
};
