const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const http = require('http');
const Message = require('./models/messageModel')
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
    const gender = user.gender;
    onlineUsers.set(userId, { socketId: socket.id, username, gender });

    io.emit('onlineUsers', Array.from(onlineUsers.entries()).map(([userId, { username, gender }]) => ({ userId, username, gender })));

    console.log('A user connected:', socket.id, 'User ID:', userId);

    socket.on('disconnect', () => {
        onlineUsers.delete(userId);
        io.emit('onlineUsers', Array.from(onlineUsers.entries()).map(([userId, { username, gender }]) => ({ userId, username, gender })));
        console.log('User disconnected:', socket.id);
    });

    socket.on('sendMessage', async (msg, callback) => {
        const { toUserId, text, fromUserId, fromUsername } = msg;
        const recipientSocketInfo = onlineUsers.get(toUserId);
        let newMessage = null;

        try {
            newMessage = new Message({
                toUserId,
                fromUserId,
                text,
                fromUsername,
                status: 'sent'
            });

            await newMessage.save();

            if (recipientSocketInfo) {
                io.to(recipientSocketInfo.socketId).emit('receiveMessage', newMessage);
                console.log(`Message sent to user ${toUserId}: ${text}`);
            } else {
                console.log(`User ${toUserId} is not online.`);
            }

            callback({ status: 'ok' });
        } catch (error) {
            console.error('Error saving message:', error);
            callback({ status: 'error', error: error.message });
        }
    });

    socket.on('refreshFriends', (data) => {
        const { sourceId, targetId } = data;
        const sourceSocketInfo = onlineUsers.get(sourceId);

        if (sourceSocketInfo) {
            io.to(sourceSocketInfo.socketId).emit('refreshFriends');
        }
        
        const targetSocketInfo = onlineUsers.get(targetId);
        
        if (targetSocketInfo) {
            io.to(targetSocketInfo.socketId).emit('refreshFriends');
        }
    })

    socket.on('refreshRequests', (data) => {
        const { targetId } = data;
        const targetSocketInfo = onlineUsers.get(targetId);

        if (targetSocketInfo) {
            io.to(targetSocketInfo.socketId).emit('refreshRequests');
            console.log('Sent refreshRequests to user:', targetId);
        }
    })


    socket.on('messageReceived', async (msg, callback) => {
        const { fromUserId, toUserId, fromUsername, text, _id } = msg;
        const newStatus = 'received';
        
        try {
            const updatedMessage = await Message.findByIdAndUpdate(
                _id,
                { status: newStatus },
                { new: true }
            );

            if (updatedMessage) {
                callback({ status: 'ok', updatedMessage });
            } else {
                callback({ status: 'error', error: 'Message not found' });
            }
        } catch (error) {
            console.error('Error updating message status:', error);
            callback({ status: 'error', error: error.message });
        }
    });

});

server.listen(3030, () => {
    console.log('Server is running on port 3030');
});
