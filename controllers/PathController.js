const isEmpty = require('./validation/is-empty');
const Path = require('../models/transports/PathModel.js');
const KeyPoint = require('../models/transports/KeyPointModel.js');
const Transport = require('../models/transports/TransportModel.js');
const Price = require('../models/transports/PriceModel.js');
const mbxMapMatching = require('@mapbox/mapbox-sdk/services/map-matching');
require('dotenv').config()
const mapMatchingClient = mbxMapMatching({
	accessToken: process.env.MAPBOX_KEY
});

var makePizza = function(arr) {
	var i;
	var pizza = [];
	for (i = 0; i < arr.length; i += 100) {
		var slice = arr.slice(i, i + 100);

		pizza.push(slice);
	}

	if (arr.length - i > 0) {
		var slice = arr.slice(i, arr.length);
		pizza.push(slice);
	}

	return pizza;
};

var mapMatch = (path) => {
	var requestsResolved = 0;
	var masterCoords = [];
	var pizza = makePizza(path.matchPoints);
	var responsesDone = 0;
	var promises = [];
	return new Promise((resolve, reject) => {
		for (i = 0; i < pizza.length; i++) {
			promises.push(
				mapMatchingClient
					.getMatch({
						points: pizza[i],
						profile: 'driving',
						geometries: 'geojson',
						tidy: true
					})
					.send()
			);
		}

		Promise.all(promises).then(
			(resps) => {
				console.log('res length', resps.length);
				for (var i = 0; i < resps.length; i++) {
					const resp = resps[i];
					const matchings = resp.body.matchings;
					for (var j = 0; j < matchings.length; j++) {
						const match = matchings[j];
						for (var k = 0; k < match.geometry.coordinates.length; k++) {
							const coord = match.geometry.coordinates[k];
							// console.log('coord.length', coord.length);
							masterCoords.push(coord);
						}
					}
				}
				resolve(masterCoords);
			},
			(error) => reject(error)
		);
	});
};

module.exports = {
	fixed(req, res) {
		var daCoords = [];
		var i;
		var j = 0;
		var pathsCeros = 0;
		Path.find()
			.then((paths) => {
				for (i = 0; i < paths.length; i++) {
					if (paths[i].line.length < 2) {
						pathsCeros++;
					}
				}
				for (i = 0; i < paths.length; i++) {
					const path = paths[i];

					if (path.line.length > 1) {
						// console.log('normal line', path.line.length, 'fixed Line ', path.fixedLine.length);
						if (!path.fixedLine && path.fixedLine.length < 1) {
							mapMatch(path)
								.then((finalCoords) => {
									path.fixedLine = finalCoords.map((coord) => {
										return { lat: coord[1], lon: coord[0] };
									});

									path.save();
									j++;
									// console.log('paths.length - pathsCeros = ', paths.length - pathsCeros);
									// console.log('j = ', j);
									if (j == paths.length - pathsCeros) {
										console.log('SENDING');
										res.send(paths);
									}
								})
								.catch((error) => console.log(error));
						}
					}
				}
			})
			.catch((error) => res.status(404).send({ message: 'Path not found', error }));
	},

	paths(req, res) {
		Path.find().exec((err, paths) => {
			if (err) res.status(500).send(err);
			res.status(200).send(paths);
		});
	},

	prices(req, res) {
		Path.findById(req.params.pathId).exec((err, path) => {
			if (err) res.status(404).send('Path not found');
			else {
				Price.find({ _id: { $in: path.prices } }).exec((err, prices) => {
					if (err) res.status(204).send('No Prices found');
					else res.status(200).send(prices);
				});
			}
		});
	},

	transport(req, res) {
		Transport.find({ paths: req.params.pathId }, (err, transports) => {
			if (err) res.status(500).send(err);
			else if (!transports) res.status(500).send({ message: 'No transport found' });
			else res.status(200).send(transports[0]);
		});
	},

	universities(req, res) {
		KeyPoint.find({ tags: 'university' }).catch((err) => res.status(500).send(err)).then((keypoints) => {
			if (keypoints.length == 0) res.status(404).send({ result: { message: 'No keypoints found' } });
			else {
				var keypointIds = keypoints.map((keypoint) => String(keypoint._id));
				Path.find()
					.then((docs) => {
						var paths = [];
						for (var i = 0; i < docs.length; i++) {
							const doc = docs[i];
							for (var j = 0; j < keypointIds.length; j++) {
								const id = keypointIds[j];
								if (doc.keypoints.map((kp) => String(kp)).includes(id)) paths.push(doc);
							}
						}
						res.status(200).send(paths);
					})
					.catch((err) => res.status(500).send(err));
			}
		});
	},

	userUniversityPaths(req, res) {
		const userUniversity = req.user.university;
		KeyPoint.findOne({ name: userUniversity }, '_id name')
			.catch((err) => res.status(500).send(err))
			.then((university) => {
				if (isEmpty(university)) res.status(404).send({ result: { message: 'User University not found' } });
				else {
					const universityId = university._id;

					Path.find()
						.then((paths) => {
							if (isEmpty(paths)) {
								res.status(404).send({ result: { message: 'No paths found' } });
							} else {
								var universityPaths = [];
								for (let i = 0; i < paths.length; i++) {
									const path = paths[i];
									const keypoints = path.keypoints;
									if (!isEmpty(keypoints)) {
										for (let j = 0; j < keypoints.length; j++) {
											const keypoint = keypoints[j];
											if (keypoint.equals(universityId)) {
												universityPaths.push(path);
												break;
											}
										}
									}
								}
								res.status(200).send(universityPaths);
							}
						})
						.catch((err) => res.status(500).send(err));
				}
			});
	},

	university(req, res) {
		KeyPoint.find({ name: req.params.name }).catch((err) => res.status(500).send(err));
	}
};
