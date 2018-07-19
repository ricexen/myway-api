const Transport = require("../models/transports/TransportModel");
const Path = require("../models/transports/PathModel");

module.exports = {
  index(req, res) {
    Transport.find({}, (err, transports) => {
      if (err) res.status(500).send(err);
      else if (transports.length == 0) res.status(204).send(transports);
      else res.status(200).send(transports);
    });
  }
};
