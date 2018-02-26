// sudo docker run -it --rm --name node -v /vagrant/node:/usr/src/app -w /usr/src/app --expose=9229 -p 9229:9229 node:9.5.0 node --inspect-brk=172.17.0.2:9229 app.js


const fs = require('fs');
const _ = require('lodash');
const yargs = require('yargs');
const request = require('request');
const axios = require('axios');

const notes = require('./notes.js');
const geocode = require('./geocode.js');

var address = yargs.options({
    address: {
      demand: true,
      default: '131 rue du Faubourg Kayl',
      alias: 'a',
      type: 'string'
    }
  })
  .help()
  .argv.address;

var geocodeAddress = (address) => {
  return new Promise((resolve, reject) => {
    request({
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}`,
      json: true
    }, (error, response, body) => {
      console.log(response);
      if (error) {
        reject(error);
      } else if (body.status !== 'OK') {
        reject(body.status);
      } else {
        resolve({
          latitude: body.results[0].geometry.location.lat,
          longitude: body.results[0].geometry.location.lng
        });
      }
    });
  })
}

geocodeAddress(address).then((result) => {
  console.log(result);
}).catch((error) => {
  console.log(error);
})

// geocode.geocodeAddress(address, result => console.log(result));
