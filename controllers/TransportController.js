const Transport = require("../models/transports/TransportModel.js");

module.exports = {
  list(req, res) {
    Transport.find()
      .catch(err => res.status(500).send(err))
      .then(transports => {
        if (transports.length === 0)
          res.status(404).send({ message: "Transports not found" });
        else res.status(200).send(transports);
      });
  },
  transport(res, req) {
    Transport.findById(req.params.id)
      .catch(err => res.status(500).send(err))
      .then(transport => res.status(200).send(transport));
  }
};
