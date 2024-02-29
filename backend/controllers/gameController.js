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
async function getGameById(req, res, next) {
  try {
    const game = await GameService.getGameById(req.params.id);
    res.status(200).json(game);
  } catch (err) {
    next(err);
  }
}

async function getGames(req, res, next) {
  try {
    const games = await GameService.getGames();
    res.status(200).json(games);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  startNewGame,
  getGameById,
  getGames,
};
