"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Game = require('../models/game');

var User = require('../models/user');

var _require = require('../utils/handSolver'),
    showdown = _require.showdown;

var gameMessage = "";

function resetGames() {
  return regeneratorRuntime.async(function resetGames$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Game.updateMany({}, {
            $set: {
              players: [],
              gameRound: "waiting",
              pot: 0,
              communityCards: [null, null, null, null, null],
              remainingCardDeck: []
            }
          }));

        case 3:
          _context.next = 8;
          break;

        case 5:
          _context.prev = 5;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 5]]);
}

function getGameData(gameID) {
  return regeneratorRuntime.async(function getGameData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 3:
          return _context2.abrupt("return", _context2.sent);

        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2["catch"](0);
          console.error('Error getting game data:', _context2.t0);

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 6]]);
}

function removePlayerFromGame(gameID, playerID) {
  var game, updateResult;
  return regeneratorRuntime.async(function removePlayerFromGame$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.t0 = regeneratorRuntime;
          _context3.t1 = Game;
          _context3.next = 5;
          return regeneratorRuntime.awrap(gameID);

        case 5:
          _context3.t2 = _context3.sent;
          _context3.t3 = _context3.t1.findById.call(_context3.t1, _context3.t2);
          _context3.next = 9;
          return _context3.t0.awrap.call(_context3.t0, _context3.t3);

        case 9:
          game = _context3.sent;

          if (game) {
            _context3.next = 13;
            break;
          }

          console.error('Game not found ' + gameID, " player: " + playerID);
          return _context3.abrupt("return");

        case 13:
          _context3.next = 15;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $pull: {
              players: {
                _id: playerID
              }
            }
          }));

        case 15:
          updateResult = _context3.sent;

          if (!updateResult.modifiedCount > 0) {
            console.error('Player error while removing from game: ' + playerID);
          }

          _context3.next = 22;
          break;

        case 19:
          _context3.prev = 19;
          _context3.t4 = _context3["catch"](0);
          console.error('Error removing player from game:', _context3.t4);

        case 22:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 19]]);
}

function addPlayerToGame(playerID) {
  var availableGames, player, playerName, playersGame, newGame;
  return regeneratorRuntime.async(function addPlayerToGame$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Game.find({
            $where: 'this.players.length <= 5',
            players: {
              $elemMatch: {
                _id: {
                  $ne: playerID
                }
              }
            }
          }));

        case 3:
          availableGames = _context4.sent;
          _context4.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            _id: playerID
          }));

        case 6:
          player = _context4.sent;
          playerName = player.username;

          if (!(availableGames.length > 0)) {
            _context4.next = 17;
            break;
          }

          _context4.next = 11;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: availableGames[0]._id
          }, {
            $push: {
              players: {
                _id: playerID,
                name: playerName,
                waitingForRoundStart: true
              }
            }
          }));

        case 11:
          playersGame = _context4.sent;
          _context4.next = 14;
          return regeneratorRuntime.awrap(Game.findById(availableGames[0]._id));

        case 14:
          return _context4.abrupt("return", _context4.sent);

        case 17:
          _context4.next = 19;
          return regeneratorRuntime.awrap(Game.create({
            players: [{
              _id: playerID,
              name: playerName,
              waitingForRoundStart: true
            }]
          }));

        case 19:
          newGame = _context4.sent;
          return _context4.abrupt("return", newGame);

        case 21:
          _context4.next = 26;
          break;

        case 23:
          _context4.prev = 23;
          _context4.t0 = _context4["catch"](0);
          console.error('Error finding or creating game:', _context4.t0);

        case 26:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 23]]);
}

function giveEachPlayerCards(game) {
  var numberOfCards,
      possibleCards,
      usedCards,
      i,
      j,
      card,
      _args5 = arguments;
  return regeneratorRuntime.async(function giveEachPlayerCards$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          numberOfCards = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : 2;
          _context5.prev = 1;
          possibleCards = [];

          if (game.remainingCardDeck.length > numberOfCards * game.players.length) {
            possibleCards = game.remainingCardDeck;
          } else {
            possibleCards = ["2C", "2D", "2H", "2S", "3C", "3D", "3H", "3S", "4C", "4D", "4H", "4S", "5C", "5D", "5H", "5S", "6C", "6D", "6H", "6S", "7C", "7D", "7H", "7S", "8C", "8D", "8H", "8S", "9C", "9D", "9H", "9S", "TC", "TD", "TH", "TS", "JC", "JD", "JH", "JS", "QC", "QD", "QH", "QS", "KC", "KD", "KH", "KS", "AC", "AD", "AH", "AS"];
          }

          usedCards = [];
          i = 0;

        case 6:
          if (!(i < game.players.length)) {
            _context5.next = 14;
            break;
          }

          if (!(game.players[i].cards.length > 0)) {
            _context5.next = 10;
            break;
          }

          console.error('Player already has cards');
          return _context5.abrupt("return");

        case 10:
          for (j = 0; j < numberOfCards; j++) {
            card = possibleCards[Math.floor(Math.random() * possibleCards.length)];

            while (usedCards.includes(card)) {
              card = possibleCards[Math.floor(Math.random() * possibleCards.length)];
            }

            usedCards.push(card);
            game.players[i].cards.push(card);
          }

        case 11:
          i++;
          _context5.next = 6;
          break;

        case 14:
          game.remainingCardDeck = possibleCards.filter(function (card) {
            return !usedCards.includes(card);
          });
          _context5.next = 17;
          return regeneratorRuntime.awrap(game.save());

        case 17:
          _context5.next = 22;
          break;

        case 19:
          _context5.prev = 19;
          _context5.t0 = _context5["catch"](1);
          console.error('Error giving cards to players:', _context5.t0);

        case 22:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 19]]);
}

function getCommunityCards(game, numberOfCards) {
  var possibleCards, finalCards, usedCards, j, card;
  return regeneratorRuntime.async(function getCommunityCards$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          possibleCards = [];

          if (game.remainingCardDeck.length > numberOfCards) {
            possibleCards = game.remainingCardDeck;
          } else {
            possibleCards = ["2C", "2D", "2H", "2S", "3C", "3D", "3H", "3S", "4C", "4D", "4H", "4S", "5C", "5D", "5H", "5S", "6C", "6D", "6H", "6S", "7C", "7D", "7H", "7S", "8C", "8D", "8H", "8S", "9C", "9D", "9H", "9S", "TC", "TD", "TH", "TS", "JC", "JD", "JH", "JS", "QC", "QD", "QH", "QS", "KC", "KD", "KH", "KS", "AC", "AD", "AH", "AS"];
          }

          finalCards = [];
          usedCards = [];

          for (j = 0; j < numberOfCards; j++) {
            card = possibleCards[Math.floor(Math.random() * possibleCards.length)];

            while (usedCards.includes(card)) {
              card = possibleCards[Math.floor(Math.random() * possibleCards.length)];
            }

            usedCards.push(card);
            finalCards.push(card);
          }

          game.remainingCardDeck = possibleCards.filter(function (card) {
            return !usedCards.includes(card);
          });
          _context6.next = 8;
          return regeneratorRuntime.awrap(game.save());

        case 8:
          return _context6.abrupt("return", finalCards);

        case 9:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function advanceTurn(gameID) {
  var game, playerIndex, newPlayerIndex;
  return regeneratorRuntime.async(function advanceTurn$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 2:
          game = _context7.sent;
          playerIndex = game.players.findIndex(function (player) {
            return player._id === game.currentTurn;
          });
          newPlayerIndex = 0; // find index of current turn player

          if (playerIndex === game.players.length - 1) {
            newPlayerIndex = 0;
          } else {
            newPlayerIndex = playerIndex + 1;
          }

          while (game.players[newPlayerIndex].isFolded || game.players[newPlayerIndex].isAllIn || game.players[newPlayerIndex].waitingForRoundStart) {
            if (newPlayerIndex === game.players.length - 1) {
              newPlayerIndex = 0;
            } else {
              newPlayerIndex++;
            }
          }

          if (game.players[playerIndex].hasBlinds) {
            game.players[playerIndex].hasBlinds = false;
          }

          game.currentTurn = game.players[newPlayerIndex]._id; // console.log('New turn: ' + game.players[newPlayerIndex]);

          _context7.next = 11;
          return regeneratorRuntime.awrap(game.save());

        case 11:
        case "end":
          return _context7.stop();
      }
    }
  });
}

function playerFold(gameID, playerID) {
  var game, playerIndex;
  return regeneratorRuntime.async(function playerFold$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 3:
          game = _context8.sent;
          playerIndex = game.players.findIndex(function (player) {
            return player._id === playerID;
          });

          if (game) {
            _context8.next = 8;
            break;
          }

          console.error('Game or player not found');
          return _context8.abrupt("return");

        case 8:
          game.players[playerIndex].isFolded = true;
          game.players[playerIndex].betAmount = null;
          _context8.next = 12;
          return regeneratorRuntime.awrap(advanceTurn(gameID));

        case 12:
          gameMessage = 'Player ' + game.players[playerIndex].name + " folded";
          _context8.next = 15;
          return regeneratorRuntime.awrap(game.save());

        case 15:
          _context8.next = 17;
          return regeneratorRuntime.awrap(applyGameRules(gameID));

        case 17:
          _context8.next = 22;
          break;

        case 19:
          _context8.prev = 19;
          _context8.t0 = _context8["catch"](0);
          console.error('Error folding:', _context8.t0);

        case 22:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 19]]);
}

function playerBet(gameID, playerID, betAmount) {
  var game, playerIndex, biggestBet, i;
  return regeneratorRuntime.async(function playerBet$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 3:
          game = _context9.sent;
          playerIndex = game.players.findIndex(function (player) {
            return player._id === playerID;
          });
          if (betAmount === null) betAmount = 0; // console.log(playerIndex, playerID, game);

          if (game) {
            _context9.next = 9;
            break;
          }

          console.error('Game not found');
          return _context9.abrupt("return", game);

        case 9:
          if (!(game.currentTurn !== playerID)) {
            _context9.next = 12;
            break;
          }

          console.error('Not your turn');
          return _context9.abrupt("return", game);

        case 12:
          if (game.players[playerIndex].isFolded) {
            console.error('Player is folded');
          }

          biggestBet = 0;

          for (i = 0; i < game.players.length; i++) {
            if (game.players[i].betAmount > biggestBet) {
              biggestBet = game.players[i].betAmount;
            }
          }

          if (!(betAmount < biggestBet && betAmount + game.players[playerIndex].betAmount < biggestBet)) {
            _context9.next = 18;
            break;
          }

          console.error('Bet amount is too low');
          return _context9.abrupt("return", game);

        case 18:
          if (betAmount > game.players[playerIndex].chips || betAmount === game.players[playerIndex].chips) {
            game.players[playerIndex].isAllIn = true;
            game.players[playerIndex].betAmount += parseInt(game.players[playerIndex].chips) - parseInt(game.players[playerIndex].betAmount);
            game.players[playerIndex].chips = 0;
            game.pot += parseInt(game.players[playerIndex].betAmount);
            gameMessage = 'Player ' + game.players[playerIndex].name + " went all in with " + game.players[playerIndex].betAmount + " chips";
          } else {
            if (game.players[playerIndex].betAmount) {
              game.players[playerIndex].betAmount += parseInt(betAmount);
            } else {
              game.players[playerIndex].betAmount = parseInt(betAmount);
            }

            game.players[playerIndex].chips -= parseInt(betAmount);
            game.pot = parseInt(betAmount) + parseInt(game.pot);
            gameMessage = 'Player ' + game.players[playerIndex].name + " bet " + betAmount + " chips";
          }

          _context9.next = 21;
          return regeneratorRuntime.awrap(advanceTurn(gameID));

        case 21:
          _context9.next = 23;
          return regeneratorRuntime.awrap(game.save());

        case 23:
          _context9.next = 25;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 25:
          return _context9.abrupt("return", _context9.sent);

        case 28:
          _context9.prev = 28;
          _context9.t0 = _context9["catch"](0);
          console.error('Error betting:', _context9.t0);

        case 31:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 28]]);
} // function parseCards(players) {
//     //[ [ '8H', '3S' ], [ '3H', 'TC' ] ] to [[[8, 'H'], [3, 'S']], [[3, 'H'], [10, 'C']]]
// }


function parseCards(cards) {
  return cards.map(function (hand) {
    return hand.map(function (card) {
      return [getValue(card.slice(0, -1)), // Get numeric value
      card.slice(-1) // Get suit
      ];
    });
  });
}

function getValue(valueStr) {
  var valueMap = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'T': 10,
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14
  };
  return valueMap[valueStr];
}

function parseCommunityCards(communityCards) {
  var newCards = [];

  for (var i = 0; i < communityCards.length; i++) {
    newCards.push(Array.from(communityCards[i]));

    if (newCards[i][0] === 'T') {
      newCards[i][0] = 10;
    } else if (newCards[i][0] === 'J') {
      newCards[i][0] = 11;
    } else if (newCards[i][0] === 'Q') {
      newCards[i][0] = 12;
    } else if (newCards[i][0] === 'K') {
      newCards[i][0] = 13;
    } else if (newCards[i][0] === 'A') {
      newCards[i][0] = 14;
    } else {
      newCards[i][0] = parseInt(newCards[i][0]);
    }
  }

  return newCards;
}

function checkIfPlayersActed(game) {
  var playersLeft = [];
  var biggestBet = 0;
  console.log('Checking if all players acted');
  console.log("Amount of players to be checked:" + game.players.length);

  for (var i = 0; i < game.players.length; i++) {
    if (game.players[i].betAmount > biggestBet) {
      biggestBet = game.players[i].betAmount;
    }
  }

  var amountOfPLayersLeft = 0;

  for (var i = 0; i < game.players.length; i++) {
    // console.log('Biggest bet: ' + biggestBet + ' \n' + game.players[i].isFolded + ' \n' + game.players[i].isAllIn + ' \n' + game.players[i].waitingForRoundStart + ' \n' + game.players[i].connecting, ' \n' + game.players[i].betAmount + ' \n' + game.players[i].hasBlinds + ' \n' + game.players[i].betAmount === 2, ' \n' + game.players[i].betAmount === biggestBet, ' \n');
    if (game.players[i].isFolded || game.players[i].isAllIn || game.players[i].waitingForRoundStart || game.players[i].connecting) {
      console.log('players acted ' + i);
    } else if (game.players[i].betAmount !== biggestBet || game.players[i].hasBlinds && game.players[i].betAmount === 2) {
      console.log('player has not acted ' + i);
      playersLeft.push(game.players[i]);
      amountOfPLayersLeft++;
    }
  }

  return playersLeft;
}

function handleWin(game) {
  var playersLeft, _i, winnerIndex, playerCards, i, _showdown, _showdown2, _winnerIndex, playersHandsValue, winner;

  return regeneratorRuntime.async(function handleWin$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          console.log('Checking for winning players');
          playersLeft = [];

          for (_i = 0; _i < game.players.length; _i++) {
            if (!game.players[_i].isFolded && !game.players[_i].waitingForRoundStart && !game.players[_i].connecting) playersLeft.push(game.players[_i]);
          }

          if (!(game.gameRound !== 'showdown')) {
            _context10.next = 17;
            break;
          }

          if (!(playersLeft.length === 1)) {
            _context10.next = 14;
            break;
          }

          winnerIndex = game.players.findIndex(function (player) {
            return player._id === playersLeft[0]._id;
          });
          gameMessage = 'Winner: ' + game.players[winnerIndex].name + " won " + game.pot + " chips";
          game.players[winnerIndex].chips += game.pot;
          game.pot = 0;
          _context10.next = 11;
          return regeneratorRuntime.awrap(game.save());

        case 11:
          return _context10.abrupt("return", game.players[winnerIndex]);

        case 14:
          return _context10.abrupt("return", false);

        case 15:
          _context10.next = 29;
          break;

        case 17:
          if (!(game.gameRound === 'showdown')) {
            _context10.next = 29;
            break;
          }

          playerCards = [];

          for (i = 0; i < playersLeft.length; i++) {
            playerCards.push(playersLeft[i].cards);
          }

          _showdown = showdown(parseCards(playerCards), parseCommunityCards(game.communityCards)), _showdown2 = _slicedToArray(_showdown, 2), _winnerIndex = _showdown2[0], playersHandsValue = _showdown2[1];
          winner = game.players[_winnerIndex];
          game.players[_winnerIndex].chips += game.pot;
          console.log('Winner: ' + winner, "won: " + game.pot + " chips");
          gameMessage = 'Winner: ' + game.players[_winnerIndex].name + " won " + game.pot + " chips" + "with hand value:" + playersHandsValue[_winnerIndex];
          game.pot = 0;
          _context10.next = 28;
          return regeneratorRuntime.awrap(game.save());

        case 28:
          return _context10.abrupt("return", winner);

        case 29:
        case "end":
          return _context10.stop();
      }
    }
  });
}

function applyGameRules(gameID) {
  var game, nullCount, i, _cards, cards, card, _card, _cards2, _i2, _i3, buttonIndex, smallBlindIndex, bigBlindIndex, _smallBlindIndex, _bigBlindIndex, nextTurnIndex, playersActed, playersLeftInGame, _i4, playersAllIn, _i5, playerWon;

  return regeneratorRuntime.async(function applyGameRules$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 2:
          game = _context11.sent;
          // console.log('game is ===== '+ game);
          console.log('Applying game rules to game ' + gameID);

          if (game) {
            _context11.next = 7;
            break;
          }

          console.error('Game not found');
          return _context11.abrupt("return");

        case 7:
          nullCount = 0;

          for (i = 0; i < game.communityCards.length; i++) {
            if (game.communityCards[i] === null) {
              nullCount++;
            }
          } // Set community cards


          _context11.t0 = game.gameRound;
          _context11.next = _context11.t0 === 'preflop' ? 12 : _context11.t0 === 'flop' ? 17 : _context11.t0 === 'turn' ? 26 : _context11.t0 === 'river' ? 35 : _context11.t0 === 'waiting' ? 43 : 83;
          break;

        case 12:
          console.log('Preflop');

          if (!(nullCount !== 5)) {
            _context11.next = 16;
            break;
          }

          _context11.next = 16;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              communityCards: [null, null, null, null, null]
            }
          }));

        case 16:
          return _context11.abrupt("break", 85);

        case 17:
          if (!(nullCount === 5)) {
            _context11.next = 25;
            break;
          }

          _context11.next = 20;
          return regeneratorRuntime.awrap(getCommunityCards(game, 3));

        case 20:
          _cards = _context11.sent;

          _cards.push(null);

          _cards.push(null);

          _context11.next = 25;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              communityCards: _cards
            }
          }));

        case 25:
          return _context11.abrupt("break", 85);

        case 26:
          cards = [];

          if (!(nullCount === 2)) {
            _context11.next = 34;
            break;
          }

          _context11.next = 30;
          return regeneratorRuntime.awrap(getCommunityCards(game, 1));

        case 30:
          card = _context11.sent;
          cards = [game.communityCards[0], game.communityCards[1], game.communityCards[2], card[0], null];
          _context11.next = 34;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              communityCards: cards
            }
          }));

        case 34:
          return _context11.abrupt("break", 85);

        case 35:
          if (!(nullCount === 1)) {
            _context11.next = 42;
            break;
          }

          _context11.next = 38;
          return regeneratorRuntime.awrap(getCommunityCards(game, 1));

        case 38:
          _card = _context11.sent;
          _cards2 = [game.communityCards[0], game.communityCards[1], game.communityCards[2], game.communityCards[3], _card[0]];
          _context11.next = 42;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              communityCards: _cards2
            }
          }));

        case 42:
          return _context11.abrupt("break", 85);

        case 43:
          _i2 = 0;

        case 44:
          if (!(_i2 < game.players.length)) {
            _context11.next = 56;
            break;
          }

          if (!(game.players[_i2].chips <= 0)) {
            _context11.next = 53;
            break;
          }

          console.log('Player ' + game.players[_i2]._id + ' is out of chips');
          _context11.next = 49;
          return regeneratorRuntime.awrap(removePlayerFromGame(gameID, game.players[_i2]._id));

        case 49:
          _context11.next = 51;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 51:
          game = _context11.sent;
          gameMessage = "Player " + game.players[_i2]._id + " is out of chips";

        case 53:
          _i2++;
          _context11.next = 44;
          break;

        case 56:
          _context11.next = 58;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 58:
          game = _context11.sent;
          activePlayers = [];

          for (_i3 = 0; _i3 < game.players.length; _i3++) {
            if (!game.players[_i3].waitingForRoundStart && !game.players[_i3].connecting) activePlayers.push(game.players[_i3]);
          }

          if (!(game.players.length < 2)) {
            _context11.next = 65;
            break;
          }

          console.log('Not enough players to start game');
          _context11.next = 82;
          break;

        case 65:
          if (!(game.players.length >= 2)) {
            _context11.next = 82;
            break;
          }

          console.log('Starting game...'); // set the button

          _context11.next = 69;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              "players.$[].betAmount": null,
              "players.$[].waitingForRoundStart": false,
              "players.$[].isFolded": false,
              "players.$[].isAllIn": false,
              "players.$[].cards": [],
              communityCards: [null, null, null, null, null]
            }
          }));

        case 69:
          buttonIndex = game.players.findIndex(function (player) {
            return player._id === game.button;
          });

          if (game.button === null) {
            game.button = game.players[0]._id; //TODO: make random
          }

          if (activePlayers.length === 2) {
            if (buttonIndex === 0) {
              game.button = game.players[1]._id;
              game.currentTurn = game.players[1]._id;
            } else {
              game.button = game.players[0]._id;
              game.currentTurn = game.players[0]._id;
            } // set the blinds


            smallBlindIndex = game.players.findIndex(function (player) {
              return player._id === game.button;
            });
            bigBlindIndex = smallBlindIndex + 1;
            if (bigBlindIndex === game.players.length) bigBlindIndex = 0;
            game.players[bigBlindIndex].hasBlinds = true;
            game.players[bigBlindIndex].betAmount = 2;
            game.players[bigBlindIndex].chips -= 2;
            game.players[smallBlindIndex].betAmount = 1;
            game.players[smallBlindIndex].chips -= 1;
          } else {
            if (buttonIndex === game.players.length - 1) {
              game.button = game.players[0]._id;
            } else {
              game.button = game.players[buttonIndex + 1]._id;
            }

            _smallBlindIndex = game.players.findIndex(function (player) {
              return player._id === game.button;
            }) + 1;
            if (_smallBlindIndex === game.players.length) _smallBlindIndex = 0;
            _bigBlindIndex = _smallBlindIndex + 1;
            if (_bigBlindIndex === game.players.length) _bigBlindIndex = 0;
            nextTurnIndex = _bigBlindIndex + 1;
            if (nextTurnIndex === game.players.length) nextTurnIndex = 0;
            game.players[_bigBlindIndex].hasBlinds = true;
            game.players[_bigBlindIndex].betAmount = 2;
            game.players[_bigBlindIndex].chips -= 2;
            game.players[_smallBlindIndex].betAmount = 1;
            game.players[_smallBlindIndex].chips -= 1;
            game.currentTurn = game.players[nextTurnIndex]._id;
          }

          game.pot = 3;
          game.gameRound = 'preflop';
          _context11.next = 76;
          return regeneratorRuntime.awrap(game.save());

        case 76:
          _context11.next = 78;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 78:
          game = _context11.sent;
          _context11.next = 81;
          return regeneratorRuntime.awrap(giveEachPlayerCards(game));

        case 81:
          gameMessage = "Handing out cards";

        case 82:
          return _context11.abrupt("break", 85);

        case 83:
          console.error('Invalid game round: ' + game.gameRound);
          return _context11.abrupt("break", 85);

        case 85:
          _context11.next = 87;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 87:
          game = _context11.sent;
          playersActed = checkIfPlayersActed(game);
          playersLeftInGame = [];

          for (_i4 = 0; _i4 < game.players.length; _i4++) {
            if (!game.players[_i4].isFolded && !game.players[_i4].waitingForRoundStart && !game.players[_i4].connecting) playersLeftInGame.push(game.players[_i4]);
          }

          playersAllIn = [];

          for (_i5 = 0; _i5 < game.players.length; _i5++) {
            if (game.players[_i5].isAllIn) playersAllIn.push(game.players[_i5]);
          }

          if (!(game.gameRound !== 'waiting' && playersActed.length === 0 && playersLeftInGame !== 1 && !(game.gameRound === 'showdown' && playersAllIn.length > 0))) {
            _context11.next = 125;
            break;
          }

          _context11.next = 96;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              "players.$[].betAmount": null,
              "players.$[].hasBlinds": false
            }
          }));

        case 96:
          _context11.t1 = game.gameRound;
          _context11.next = _context11.t1 === 'waiting' ? 99 : _context11.t1 === 'preflop' ? 101 : _context11.t1 === 'flop' ? 105 : _context11.t1 === 'turn' ? 109 : _context11.t1 === 'river' ? 113 : _context11.t1 === 'showdown' ? 116 : 119;
          break;

        case 99:
          console.error("Winning whilst waiting???");
          return _context11.abrupt("break", 121);

        case 101:
          _context11.next = 103;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              gameRound: 'flop'
            }
          }));

        case 103:
          gameMessage = "Handing out flop cards";
          return _context11.abrupt("break", 121);

        case 105:
          _context11.next = 107;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              gameRound: 'turn'
            }
          }));

        case 107:
          gameMessage = "Handing out turn card";
          return _context11.abrupt("break", 121);

        case 109:
          _context11.next = 111;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              gameRound: 'river'
            }
          }));

        case 111:
          gameMessage = "Handing out river card";
          return _context11.abrupt("break", 121);

        case 113:
          _context11.next = 115;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              gameRound: 'showdown'
            }
          }));

        case 115:
          return _context11.abrupt("break", 121);

        case 116:
          _context11.next = 118;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              gameRound: 'waiting'
            }
          }));

        case 118:
          return _context11.abrupt("break", 121);

        case 119:
          console.error('Wrong GameRound ' + gameID.gameRound);
          return _context11.abrupt("break", 121);

        case 121:
          _context11.next = 123;
          return regeneratorRuntime.awrap(applyGameRules(gameID));

        case 123:
          _context11.next = 136;
          break;

        case 125:
          if (!(game.gameRound !== 'waiting' && (playersLeftInGame.length === 1 || game.gameRound === 'showdown'))) {
            _context11.next = 136;
            break;
          }

          console.error('Game over');
          _context11.next = 129;
          return regeneratorRuntime.awrap(handleWin(game));

        case 129:
          playerWon = _context11.sent;

          if (!playerWon) {
            _context11.next = 136;
            break;
          }

          _context11.next = 133;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              gameRound: 'waiting'
            }
          }));

        case 133:
          gameMessage = "Player " + playerWon.name + " won " + game.pot + " chips";
          _context11.next = 136;
          return regeneratorRuntime.awrap(applyGameRules(gameID));

        case 136:
          _context11.next = 138;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 138:
          _context11.t2 = _context11.sent;
          _context11.t3 = gameMessage;
          return _context11.abrupt("return", [_context11.t2, _context11.t3]);

        case 141:
        case "end":
          return _context11.stop();
      }
    }
  });
}

module.exports = {
  resetGames: resetGames,
  getGameData: getGameData,
  addPlayerToGame: addPlayerToGame,
  applyGameRules: applyGameRules,
  removePlayerFromGame: removePlayerFromGame,
  playerBet: playerBet,
  playerFold: playerFold
};