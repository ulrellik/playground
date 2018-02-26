// sudo docker run -it --rm --name node -v /vagrant/node:/usr/src/app -w /usr/src/app --expose=9229 -p 9229:9229 --expose=3000 -p 3000:3000 node:9.5.0 node app.js

// sudo docker run -it --rm --name node -v /vagrant/node:/usr/src/app -w /usr/src/app node:9.5.0 npm install express --save --no-bin-links
const express = require('express');
const hbs = require('hbs');


const PORT = process.env.PORT || 3000;
const MAINTENANCE = false;
var app = express();


hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('upperCase', text => text.toUpperCase());

app.set('view engine', 'hbs');

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  if (MAINTENANCE) {
    res.render('maintenance.hbs');
  } else {
    next();
  }
});

app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
  res.send({
    name: 'Jerome',
    age: '31'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    name: "Jerome"
  })
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
