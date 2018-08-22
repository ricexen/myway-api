const KeyPoint = require("../models/transports/KeyPointModel.js");

var KeyPointController = {};
/**
 *
 * @param {Array} tags
 * @param {Array} keypoints
 */
KeyPointController.mapByTags = (tags, keypoints) => {
  for (var kp = keypoints.length - 1; kp >= 0; kp--) {
    const keypoint = keypoints[kp];
    var includes = false;
    for (var i = 0; i < tags.length; i++)
      if (!includes && keypoint.tags.includes(String(tags[i]))) includes = true;
    if (!includes) keypoints.splice(kp, 1);
  }
  return keypoints;
};

module.exports = {
  list(req, res) {
    KeyPoint.find()
      .sort({ name: 1 })
      .catch(err => res.status(500).send(err))
      .then(keypoints => {
        if (keypoints.length === 0)
          res.status(404).send({ message: "Puntos clave no encontrados" });
        else if (req.query.tags) {
          var tags = req.query.tags.split(",");
          res.status(200).send(KeyPointController.mapByTags(tags, keypoints));
        } else res.status(200).send(keypoints);
      });
  }
};
