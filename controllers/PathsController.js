const Path = require('../models/transports/PathModel.js');
const Transport = require('../models/transports/TransportModel.js');
module.exports = {
	paths(req, res) {
		Path.find().exec((err, paths) => {
			if (err) res.status(500).send(err);
			res.send(paths);
		});
	},

	pathsGeoJSON(req, res) {
		var pathArr = [];
		Path.find().exec((err, paths) => {
			for (let index = 0; index < paths.length; index++) {
				const path = paths[index];
				var coords = [];
				for (var j = 0; j < path.line.length; j++) {
					coords.push([ path.line[j].lon, path.line[j].lat ]);
				}
				var geojson = {
					type: 'FeatureCollection',
					features: [
						{
							type: 'Feature',
							properties: {
								name: 'NOMBRE',
								desc: 'Length: 8.63 km (5.362 mi)',
								color: 'white'
							},
							geometry: {
								type: 'LineString',
								coordinates: [ [] ]
							}
						}
					]
				};
				geojson.features[0].geometry.coordinates = coords;

				pathArr.push(geojson);
			}
			if (err) res.status(500).send(err);
			res.send(pathArr);
		});
	},
	prices(req, res) {
		Path.findById(req.params.pathId).exec((err, path) => {
			if (err) res.status(404).send('Path not found');
			else res.send(path.prices);
		});
	},
	transport(req, res) {
		Transport.find({ paths: req.params.pathId }, (err, transports) => {
			if (err) res.status(500).send(err);
			else if (!transports) res.status(500).send({ message: 'No transport found' });
			else res.status(200).send(transports[0]);
		});
	}
};
