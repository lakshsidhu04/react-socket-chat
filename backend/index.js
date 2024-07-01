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
        credentials: true // Allow credentials
    },
});

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true // Allow cookies to be sent
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/chatapp')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

app.use('/api/auth', AuthRouter);
app.use('/api/users', UserRouter);

io.on('connection', (socket) => {
    console.log('a user connected with id ' + socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat-message', (message, user) => {
        console.log(message);
        io.emit('chat-message', message, user);
    });
});

server.listen(3030, () => {
    console.log('Server is running on port 3030');
});
