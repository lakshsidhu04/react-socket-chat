const express = require('express');
const { login, signup, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
