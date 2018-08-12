// Calculator to comprobate the distances
// http://www.meridianoutpost.com/resources/etools/calculators/calculator-latitude-longitude-distance.php?

const assert = require("chai").assert;
const DistancesController = require("../controllers/PathController.js");
const shortnessDistance = DistancesController.shortestDistance;
const distance = require('@turf/distance').default;

const pointA = [-96.80322, 32.9697];
const pointB = [-98.53506, 29.46786];
const pointC = [29.46786, -128.53506];

describe("Geo: shortness distance", () => {
  it("Should be return 422.74 kilometers", done => {
    assert.approximately(distance(pointA, pointB, {units: 'kilometers'}), 422.74, 0.1);
    done();
  });
  it("Should be return pointB", done => {
    var points = []
    for(var i = 0; i<500; i++){
      points.push(pointB)
      points.push(pointC)
    }
    assert.equal(shortnessDistance(pointA, points), pointB);
    done();
  });
});
