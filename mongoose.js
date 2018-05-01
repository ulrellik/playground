const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://192.168.0.50:27017/test');

var todoSchema = mongoose.Schema({
  description: {
    type: String
  },
  date: {
    type: Date
  },
  completed: {
    type: Boolean
  }
});

var Todo = mongoose.model('Todo', todoSchema);

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
  console.log(req.body);
  res.send('test OK!');
});

app.listen(3000, () => console.log('Server listening on 3000'));
