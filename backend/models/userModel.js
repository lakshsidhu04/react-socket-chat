const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required
    : true  },
    gender: { type: String, default:'Male'},
    profilePic: { type: String, default: 'https://www.w3schools.com/w3images/avatar2.png' },
    friends:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    
    ],
    requests:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    
    ],
})

const User = mongoose.model('User', userSchema);
module.exports = User;