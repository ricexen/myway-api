const gpx = require("gpx-parse");
module.exports = {
  Path: {
    ParamsFromGpx(
      file,
      callback = (err, obj) => {
        if (err) console.log(err);
      }
    ) {
      gpx.parseGpxFromFile(file, (err, obj) => {
        if (err) console.log(err);
        else {
          console.log(
            obj.tracks[0].segments[0].map(obj => {
              return { lat: obj.lat, lon: obj.lon };
            })
          );
          console.log(obj.tracks[0].name);
        }
      });
    }
  }
};
