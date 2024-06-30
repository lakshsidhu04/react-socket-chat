const jwt = require('jsonwebtoken');

const generateAuthToken = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const cookieOptions = {
        maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000, // Convert days to milliseconds
        httpOnly: true,
    };

    res.cookie('jwt', token, cookieOptions);
};

module.exports = generateAuthToken;
