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

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('joinRoom', ({ roomName }) => {
        socket.join(roomName);
        console.log(`User ${socket.id} joined room: ${roomName}`);
    });
    
    socket.on('sendMessage', (msg, callback) => {
        const roomName = msg.room;
        console.log(`Received sendMessage event for room ${roomName}: ${msg.text}`);
        io.to(roomName).emit('message', msg);
        console.log(`Message sent to room ${roomName}: ${msg.text}`);
        callback({ status: 'ok' }); // Send acknowledgment back to the client
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3030, () => {
    console.log('Server is running on port 3030');
});
