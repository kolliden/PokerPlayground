const express = require('express');
const router = express.Router();
const GameController = require('../controllers/gameController');

// Define game-related routes
router.post('/games', GameController.startNewGame);
// Define other game-related routes (play turn, end game, get by id, etc.)

module.exports = router;
