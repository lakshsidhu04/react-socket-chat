const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

let users = [];

io.on('connection', (socket) => {
    users.push(socket.id);
    io.emit('user-joined', socket.id);
    console.log('a user connected with id ' + socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected');
        users = users.filter((user) => user !== socket.id);
        io.emit('user-left', socket.id); 
    });
    
    socket.on('chat-message', (message,user) => {
        console.log(message);
        io.emit('chat-message', message, user);
    });
});

server.listen(3030, () => {
    console.log('listening on *:3030');
});
