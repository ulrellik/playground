const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000;
let app = express().use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://192.168.0.50:27017/test');

let userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.methods.toJSON = function() {
  return _.pick(this.toObject(), 'email', '_id');
};

userSchema.methods.generateToken = function() {
  let access = 'auth'
  let token = jwt.sign({
    _id: this._id.toHexString(),
    access
  }, 'secret').toString();

  this.tokens = this.tokens.concat([{
    access, token
  }]);

  return this.save().then((user) => {
    console.log('Saved user', user);
    return token;
  });
};

userSchema.methods.logout = function(token) {
  return this.update({
    $pull: {
      tokens: {
        token
      }
    }
  });
}

userSchema.statics.findByToken = function(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, 'secret');
  } catch (err) {
    return Promise.reject();
  }

  return this.findOne({
    _id: decoded._id,
    'tokens.access': 'auth',
    'tokens.token': token
  });
};

userSchema.statics.authenticate = function(email, password) {
  return this.findOne({
    email
  }).then((user) => {
    if (!user) return Promise.reject('User no found');

    return bcrypt.compare(password, user.password).then((result) => {
      return result ? user : Promise.reject('Password incorrect');
    });
  });
};

userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10).then((hash) => {
      this.password = hash;
      next();
    }).catch((err) => {
      console.log("Fatal error at creating hash", err);
      next();
    });
  } else
    next();
});

let User = mongoose.model('User', userSchema);

app.post('/user', (req, res) => {
  let user = new User(_.pick(req.body, 'email', 'password'));

  user.save().then(() => {
    console.log('Saved user', user);
    return user.generateToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

let authenticate = (req, res, next) => {
  User.findByToken(req.header('x-auth')).then((user) => {
    if (!user) return Promise.reject();
    req.user = user;
    req.token = req.header('x-auth');
    next();
  }).catch((err) => {
    res.status(401).send('Missing or incorrect token');
  });
};

app.get('/user/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/user/login', (req, res) => {
  User.authenticate(req.body.email, req.body.password).then((user) => {
    user.generateToken().then((token) => {
      res.status(200).header('x-auth', token).send(user);
    });
  }).catch((err) => {
    res.status(401).send(err);
  });
});

app.delete('/user/me/token', authenticate, (req, res) => {
  req.user.logout(req.token)
    .then(() => res.send())
    .catch(err => res.status(400).send(err));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
