const GameService = require('../services/gameService');

// Example of handling game-related operations
async function startNewGame(req, res, next) {
  try {
    const newGame = await GameService.startNewGame(req.body);
    res.status(201).json(newGame);
  } catch (err) {
    next(err);
  }
}

// Other game-related controller functions (playTurn, endGame, getGameById, etc.)

module.exports = {
  startNewGame,
  // Other exported game-related functions
};
