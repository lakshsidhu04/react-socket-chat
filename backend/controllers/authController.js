const bcrypt = require('bcryptjs');
const generateAuthToken = require('../utils/generateAuthToken');
const User = require('../models/userModel');

exports.signup = async (req, res) => {
    try {
        const { name, username, password, confirmPassword } = req.body;
        console.log(req.body);
        if (password !== confirmPassword) {
            return res.status(400).json({ status: 'fail', message: 'Passwords do not match' });
        }
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ status: 'fail', message: 'Username taken' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({ name, username, password: hashedPassword });
        console.log('created user');
        if (newUser) {
            generateAuthToken(newUser._id, res);
            await newUser.save();
            console.log('User created successfully');
            res.status(201).json({ status: 'success', data: { user: newUser } });
        }
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Log the received request body
        console.log('Request Body:', req.body);

        if (!username || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide username and password' });
        }

        const user = await User.findOne({ username });

        if (!user) {
            console.log('User not found');
            return res.status(401).json({ status: 'fail', message: 'Invalid username or password' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        console.log('Password match result:', isPasswordCorrect);
        
        if (!isPasswordCorrect) {
            console.log('Password did not match');
            return res.status(401).json({ status: 'fail', message: 'Invalid username or password' });
        }

        console.log('Password matched');
        generateAuthToken(user, res);
        console.log('User logged in', user.username);
    } catch (error) {
        console.log('Error during login:', error);
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.logout = async (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
};
