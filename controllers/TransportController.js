const Transport = require("../models/transports/TransportModel.js");
const Validation = require("../helpers/Util.js").Validation

module.exports = {
  list(req, res) {
    var command = Transport.find();
    if (!Validation.isEmpty(req.query)) {
      var populate = {};
      if (Boolean(req.query.paths)) {
        populate.path = "paths";
        if (Boolean(req.query.prices)) {
          populate.populate = { path: "prices" };
        }
      }
      command.populate(populate);
    }
    command.catch(err => res.status(500).send(err)).then(transports => {
      if (transports.length === 0)
        res.status(404).send({ message: "Transports not found" });
      else res.status(200).send(transports);
    });
  },
  transport(req, res) {
    Transport.findById(req.params.id)
      .catch(err => res.status(500).send(err))
      .then(transport => res.status(200).send(transport));
  }
};
