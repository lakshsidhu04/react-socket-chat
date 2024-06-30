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
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user?.password || ""))) {
            return res.status(401).json({ status: 'fail', message: 'Invalid username or password' });
        }
        generateAuthToken(user._id, res);
        console.log('User logged in ', user.username);
        res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
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
