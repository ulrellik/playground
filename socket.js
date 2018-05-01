const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    this.users.push({id, name, room});
  }

  removeUser(id) {
    let user = this.getUser(id);
    this.users = this.users.filter((user) => user.id !== id);
    return user;
  }

  getUser(id) {
    return this.users.find((user) => user.id === id);
  }

  getUsers(room) {
    return this.users.filter((user) => user.room === room).map((user) => user.name);
  }
}

const users = new Users();

app.use(express.static('public'));

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('chat message', function(msg, ack){
    io.to(users.getUser(socket.id).room).emit('chat message', msg);
    ack('received!')
  });

  socket.on('disconnect', function(msg, ack){
    let user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('userlist', users.getUsers());
      socket.broadcast.to(user.room).emit('chat message', `${user.name} left`);
    }
  });

  socket.on('join', function(params, ack){
    if (!params.name || !params.room) {
      return ack('Missing params');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('userlist', users.getUsers(params.room));
    socket.broadcast.to(params.room).emit('chat message', `${params.name} joined`);
    socket.emit('chat message', `Welcome ${params.name}`);

  });
});

server.listen(3000, () => console.log('server up on port 3000'));
