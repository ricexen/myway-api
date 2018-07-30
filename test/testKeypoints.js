var KeyPoint = require("../models/transports/KeyPointModel");
KeyPoint.find({ tags: ["university"] }).then(keypoints =>
  console.log(keypoints)
);
