const Path = require("../models/transports/PathModel.js");

var pathBase = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "NOMBRE",
        desc: "Length: 8.63 km (5.362 mi)",
        color: "white"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [],
        ]
      }
    }
  ]
};

module.exports = {
  paths(req, res) {
    Path.find().exec((err, paths) => {
      if (err) res.status(500).send(err);
      res.send(paths);
    });
  },

  pathsGeoJSON(req, res){
    var pathArr = [];
    Path.find().exec((err, paths) => {
      for (let index = 0; index < paths.length; index++) {
        const path = paths[index];
        var coords = [];
        for(var j =0; j<path.line.length; j++){
          coords.push([path.line[j].lon, path.line[j].lat])
        }
        var geojson = JSON.parse(JSON.stringify(pathBase))
        geojson.features[0].geometry.coordinates = coords;

        pathArr.push(geojson);
      }
      if (err) res.status(500).send(err);
      console.log(pathBase);
      res.send(pathArr);
       
      });
  },
};
