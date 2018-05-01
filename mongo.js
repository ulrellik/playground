// sudo docker run -it --rm --name node -v /vagrant/node:/usr/src/app -w /usr/src/app selfbuild/node:1.0 npm install mongodb --save --no-bin-links
// sudo docker run -it --rm --name node -v /vagrant/node:/usr/src/app -w /usr/src/app selfbuild/node:1.0 node mongo.js
const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://192.168.0.50:27017', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB!');
  }
  console.log('Connected to MongoDB on 192.168.0.50:27017');
  const db = client.db('test');

  db.collection('test1').insertOne({name: 'John', lastname: 'Doe'}, (err,result) => {
    if (err) {
      return console.log('Unable to add document to MongoDB!');
    }
    console.log(JSON.stringify(result.ops));
  });


  client.close();
});
