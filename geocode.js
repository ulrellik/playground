const request = require('request');

var geocodeAddress = (address, callback) => {
  request({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}`,
    json: true
  }, (error, response, body) => {
    // console.log(JSON.stringify(error, undefined, 2));
    // console.log(JSON.stringify(response, undefined, 2));
    callback({
      latitude: body.results[0].geometry.location.lat,
      longitude: body.results[0].geometry.location.lng
    });
  });
}


module.exports = {
  geocodeAddress
};
