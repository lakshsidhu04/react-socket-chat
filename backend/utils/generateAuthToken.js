const jwt = require('jsonwebtoken');

const generateAuthToken = (user, res) => {
    try {
        const id = user._id;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        console.log('Generated Token:', token);

        res.cookie('jwt', token, {
            maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
            httpOnly: true,
            // secure: true, // Uncomment if using HTTPS
            // sameSite: 'strict', // Uncomment if needed
        });
        console.log('Token generated and cookie set');
        res.status(200).json({ success: true , user : user});
    } catch (error) {
        console.log('Error generating token:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = generateAuthToken;
