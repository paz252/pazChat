const express = require('express');
const app = express();
const socket = require('socket.io');

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

app.use('/static',express.static('static'));

const server = app.listen(80);

const io = socket(server);

const users = {};

io.on('connection',socket=>{
    socket.on('new-user-joined',name=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message: message,name: users[socket.id]});
    });

    socket.on('disconnect',message=>{
        socket.broadcast.emit('leave',users[socket.id]);
        delete users[socket.id];
    });
})