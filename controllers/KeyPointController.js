const KeyPoint = require("../models/transports/KeyPointModel.js");

var KeyPointController = {};
/**
 *
 * @param {Array} tags
 * @param {Array} keypoints
 */
KeyPointController.mapByTags = (tags, keypoints) => {
  for (var kp = 0; kp < keypoints.length; kp++) {
    const keypoint = keypoints[kp];
    for (var t = 0; t < tags; t++) {
      const tag = tags[i];
      for (var kpt = 0; kpt < keypoint.tags.length; kpt++) {
        const keypointTag = keypoint.tags[kpt];
        if (keypointTag != tag) {
          console.log("hola");
          keypoints.pop(keypoint);
          kp--;
        }
      }
    }
  }
  return keypoints;
};

module.exports = {
  list(req, res) {
    KeyPoint.find()
      .catch(err => res.status(500).send(err))
      .then(keypoints => {
        if (keypoints.length === 0)
          res.status(404).send({ message: "Key Points not found" });
        else if (req.query.tags) {
          var tags = req.query.tags.split(",");
          res.status(200).send(KeyPointController.mapByTags(tags, keypoints));
        } else res.status(200).send(keypoints);
      });
  }
};
