const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Define authentication-related routes
router.post('/login', AuthController.login);
// Define other authentication-related routes (register, logout, reset password, etc.)

module.exports = router;