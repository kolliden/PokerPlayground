const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Define user-related routes
router.post('/users', UserController.createUser);
// Define other user-related routes (update, get, delete, etc.)

module.exports = router;
