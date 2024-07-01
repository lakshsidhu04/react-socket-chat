const jwt = require('jsonwebtoken');

const generateAuthToken = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    console.log('Token:', token)
    
    res.cookie('jwt', token, {
        maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
    console.log('Token generated and cookie set');
};

module.exports = generateAuthToken;
