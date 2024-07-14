const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'received', 'seen'],
        default: 'sent'
    },
    fromUsername: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
