// server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const AuthRouter = require('./routes/authRoute');
const UserRouter = require('./routes/UserRoute');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/chatapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

app.use('/api/auth', AuthRouter);
app.use('/api/users', UserRouter);

const onlineUsers = new Map();

io.on('connection', (socket) => {
    const user = JSON.parse(socket.handshake.query.user);
    const userId = user._id;
    const username = user.username;
    onlineUsers.set(userId, { socketId: socket.id, username });

    io.emit('onlineUsers', Array.from(onlineUsers.entries()).map(([userId, { username }]) => ({ userId, username })));

    console.log('A user connected:', socket.id, 'User ID:', userId);

    socket.on('disconnect', () => {
        onlineUsers.delete(userId);
        io.emit('onlineUsers', Array.from(onlineUsers.entries()).map(([userId, { username }]) => ({ userId, username })));
        console.log('User disconnected:', socket.id);
    });

    socket.on('sendMessage', (msg, callback) => {
        const { toUserId, text, fromUserId, fromUsername } = msg;
        const recipientSocketInfo = onlineUsers.get(toUserId);
        
        if (recipientSocketInfo) {
            io.to(recipientSocketInfo.socketId).emit('receiveMessage', msg);
            console.log(`Message sent to user ${toUserId}: ${text}`);
        } else {
            console.log(`User ${toUserId} is not online.`);
        }

        callback({ status: 'ok' });
    });
});

server.listen(3030, () => {
    console.log('Server is running on port 3030');
});
