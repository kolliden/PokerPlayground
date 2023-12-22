"use strict";

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Game = require('../models/game');

var _require = require('../utils/handSolver'),
    showdown = _require.showdown;

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

function removePlayerFromGame(gameID, playerID) {
  var game, updateResult;
  return regeneratorRuntime.async(function removePlayerFromGame$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.t0 = regeneratorRuntime;
          _context2.t1 = Game;
          _context2.next = 5;
          return regeneratorRuntime.awrap(gameID);

        case 5:
          _context2.t2 = _context2.sent;
          _context2.t3 = _context2.t1.findById.call(_context2.t1, _context2.t2);
          _context2.next = 9;
          return _context2.t0.awrap.call(_context2.t0, _context2.t3);

        case 9:
          game = _context2.sent;

          if (game) {
            _context2.next = 13;
            break;
          }

          console.error('Game not found ' + gameID, " player: " + playerID);
          return _context2.abrupt("return");

        case 13:
          _context2.next = 15;
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
          updateResult = _context2.sent;

          if (!updateResult.modifiedCount > 0) {
            console.error('Player error while removing from game: ' + playerID);
          }

          _context2.next = 22;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t4 = _context2["catch"](0);
          console.error('Error removing player from game:', _context2.t4);

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 19]]);
}

function addPlayerToGame(playerID) {
  var availableGames, playersGame, newGame;
  return regeneratorRuntime.async(function addPlayerToGame$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Game.find({
            $where: 'this.players.length <= 5'
          }));

        case 3:
          availableGames = _context3.sent;

          if (!(availableGames.length > 0)) {
            _context3.next = 13;
            break;
          }

          _context3.next = 7;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: availableGames[0]._id
          }, {
            $push: {
              players: {
                _id: playerID,
                waitingForRoundStart: true
              }
            }
          }));

        case 7:
          playersGame = _context3.sent;
          _context3.next = 10;
          return regeneratorRuntime.awrap(Game.findById(availableGames[0]._id));

        case 10:
          return _context3.abrupt("return", _context3.sent);

        case 13:
          _context3.next = 15;
          return regeneratorRuntime.awrap(Game.create({
            players: [{
              _id: playerID,
              waitingForRoundStart: true
            }]
          }));

        case 15:
          newGame = _context3.sent;
          return _context3.abrupt("return", newGame);

        case 17:
          _context3.next = 22;
          break;

        case 19:
          _context3.prev = 19;
          _context3.t0 = _context3["catch"](0);
          console.error('Error finding or creating game:', _context3.t0);

        case 22:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 19]]);
}

function giveEachPlayerCards(game) {
  var numberOfCards,
      possibleCards,
      usedCards,
      i,
      j,
      card,
      _args4 = arguments;
  return regeneratorRuntime.async(function giveEachPlayerCards$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          numberOfCards = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : 2;
          _context4.prev = 1;
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
            _context4.next = 14;
            break;
          }

          if (!(game.players[i].cards.length > 0)) {
            _context4.next = 10;
            break;
          }

          console.error('Player already has cards');
          return _context4.abrupt("return");

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
          _context4.next = 6;
          break;

        case 14:
          game.remainingCardDeck = possibleCards.filter(function (card) {
            return !usedCards.includes(card);
          });
          _context4.next = 17;
          return regeneratorRuntime.awrap(game.save());

        case 17:
          _context4.next = 22;
          break;

        case 19:
          _context4.prev = 19;
          _context4.t0 = _context4["catch"](1);
          console.error('Error giving cards to players:', _context4.t0);

        case 22:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 19]]);
}

function getCommunityCards(game, numberOfCards) {
  var possibleCards, finalCards, usedCards, j, card;
  return regeneratorRuntime.async(function getCommunityCards$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
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
          _context5.next = 8;
          return regeneratorRuntime.awrap(game.save());

        case 8:
          return _context5.abrupt("return", finalCards);

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  });
}

function advanceTurn(gameID) {
  var game, playerIndex, newPlayerIndex;
  return regeneratorRuntime.async(function advanceTurn$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 2:
          game = _context6.sent;
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

          _context6.next = 11;
          return regeneratorRuntime.awrap(game.save());

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function playerFold(gameID, playerID) {
  var game, playerIndex;
  return regeneratorRuntime.async(function playerFold$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 3:
          game = _context7.sent;
          playerIndex = game.players.findIndex(function (player) {
            return player._id === playerID;
          });

          if (game) {
            _context7.next = 8;
            break;
          }

          console.error('Game or player not found');
          return _context7.abrupt("return");

        case 8:
          game.players[playerIndex].isFolded = true;
          game.players[playerIndex].betAmount = null;
          _context7.next = 12;
          return regeneratorRuntime.awrap(advanceTurn(gameID));

        case 12:
          _context7.next = 14;
          return regeneratorRuntime.awrap(game.save());

        case 14:
          _context7.next = 16;
          return regeneratorRuntime.awrap(applyGameRules(gameID));

        case 16:
          _context7.next = 21;
          break;

        case 18:
          _context7.prev = 18;
          _context7.t0 = _context7["catch"](0);
          console.error('Error folding:', _context7.t0);

        case 21:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 18]]);
}

function playerBet(gameID, playerID, betAmount) {
  var game, playerIndex, biggestBet, i;
  return regeneratorRuntime.async(function playerBet$(_context8) {
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
          if (betAmount === null) betAmount = 0; // console.log(playerIndex, playerID, game);

          if (game) {
            _context8.next = 9;
            break;
          }

          console.error('Game not found');
          return _context8.abrupt("return", game);

        case 9:
          if (!(game.currentTurn !== playerID)) {
            _context8.next = 12;
            break;
          }

          console.error('Not your turn');
          return _context8.abrupt("return", game);

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
            _context8.next = 18;
            break;
          }

          console.error('Bet amount too small');
          return _context8.abrupt("return", game);

        case 18:
          if (!(betAmount > game.players[playerIndex].chips)) {
            _context8.next = 23;
            break;
          }

          console.error('Not enough chips');
          return _context8.abrupt("return", game);

        case 23:
          if (game.players[playerIndex].betAmount) {
            game.players[playerIndex].betAmount += parseInt(betAmount);
          } else {
            game.players[playerIndex].betAmount = parseInt(betAmount);
          }

          game.players[playerIndex].chips -= parseInt(betAmount);
          game.pot = parseInt(betAmount) + parseInt(game.pot);
          _context8.next = 28;
          return regeneratorRuntime.awrap(advanceTurn(gameID));

        case 28:
          _context8.next = 30;
          return regeneratorRuntime.awrap(game.save());

        case 30:
          _context8.next = 32;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 32:
          return _context8.abrupt("return", _context8.sent);

        case 33:
          _context8.next = 38;
          break;

        case 35:
          _context8.prev = 35;
          _context8.t0 = _context8["catch"](0);
          console.error('Error betting:', _context8.t0);

        case 38:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 35]]);
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

  console.log("newCommunityCards");
  console.log(communityCards);
  console.log(newCards);
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
  var playersLeft, _i, winnerIndex, playerCards, i, _showdown, _showdown2, _winnerIndex, PlayersHandsValue, winner;

  return regeneratorRuntime.async(function handleWin$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          console.log('Checking for winning players');
          playersLeft = [];

          for (_i = 0; _i < game.players.length; _i++) {
            if (!game.players[_i].isFolded && !game.players[_i].waitingForRoundStart && !game.players[_i].connecting) playersLeft.push(game.players[_i]);
          }

          if (!(game.gameRound !== 'showdown')) {
            _context9.next = 17;
            break;
          }

          if (!(playersLeft.length === 1)) {
            _context9.next = 14;
            break;
          }

          winnerIndex = game.players.findIndex(function (player) {
            return player._id === playersLeft[0]._id;
          });
          console.log('Winner: ' + game.players[winnerIndex], "won: " + game.pot + " chips");
          game.players[winnerIndex].chips += game.pot;
          game.pot = 0;
          _context9.next = 11;
          return regeneratorRuntime.awrap(game.save());

        case 11:
          return _context9.abrupt("return", game.players[winnerIndex]);

        case 14:
          return _context9.abrupt("return", false);

        case 15:
          _context9.next = 28;
          break;

        case 17:
          if (!(game.gameRound === 'showdown')) {
            _context9.next = 28;
            break;
          }

          playerCards = [];

          for (i = 0; i < playersLeft.length; i++) {
            playerCards.push(playersLeft[i].cards);
          }

          _showdown = showdown(parseCards(playerCards), parseCommunityCards(game.communityCards)), _showdown2 = _slicedToArray(_showdown, 2), _winnerIndex = _showdown2[0], PlayersHandsValue = _showdown2[1];
          winner = game.players[_winnerIndex];
          game.players[_winnerIndex].chips += game.pot;
          console.log('Winner: ' + winner, "won: " + game.pot + " chips");
          game.pot = 0;
          _context9.next = 27;
          return regeneratorRuntime.awrap(game.save());

        case 27:
          return _context9.abrupt("return", winner);

        case 28:
        case "end":
          return _context9.stop();
      }
    }
  });
}

function applyGameRules(gameID) {
  var game, nullCount, i, _cards, cards, card, _card, _cards2, buttonIndex, smallBlindIndex, bigBlindIndex, _smallBlindIndex, _bigBlindIndex, playersLeft, playersLeftInGame, _i2, playerWon;

  return regeneratorRuntime.async(function applyGameRules$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 2:
          game = _context10.sent;
          // console.log('game is ===== '+ game);
          console.log('Applying game rules to game ' + gameID);

          if (game) {
            _context10.next = 7;
            break;
          }

          console.error('Game not found');
          return _context10.abrupt("return");

        case 7:
          nullCount = 0;

          for (i = 0; i < game.communityCards.length; i++) {
            if (game.communityCards[i] === null) {
              nullCount++;
            }
          } // Set community cards


          _context10.t0 = game.gameRound;
          _context10.next = _context10.t0 === 'preflop' ? 12 : _context10.t0 === 'flop' ? 17 : _context10.t0 === 'turn' ? 27 : _context10.t0 === 'river' ? 36 : _context10.t0 === 'waiting' ? 44 : 65;
          break;

        case 12:
          console.log('Preflop');

          if (!(nullCount !== 5)) {
            _context10.next = 16;
            break;
          }

          _context10.next = 16;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              communityCards: [null, null, null, null, null]
            }
          }));

        case 16:
          return _context10.abrupt("break", 67);

        case 17:
          console.log('Flop');

          if (!(nullCount === 5)) {
            _context10.next = 26;
            break;
          }

          _context10.next = 21;
          return regeneratorRuntime.awrap(getCommunityCards(game, 3));

        case 21:
          _cards = _context10.sent;

          _cards.push(null);

          _cards.push(null);

          _context10.next = 26;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              communityCards: _cards
            }
          }));

        case 26:
          return _context10.abrupt("break", 67);

        case 27:
          cards = [];

          if (!(nullCount === 2)) {
            _context10.next = 35;
            break;
          }

          _context10.next = 31;
          return regeneratorRuntime.awrap(getCommunityCards(game, 1));

        case 31:
          card = _context10.sent;
          cards = [game.communityCards[0], game.communityCards[1], game.communityCards[2], card[0], null];
          _context10.next = 35;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              communityCards: cards
            }
          }));

        case 35:
          return _context10.abrupt("break", 67);

        case 36:
          if (!(nullCount === 1)) {
            _context10.next = 43;
            break;
          }

          _context10.next = 39;
          return regeneratorRuntime.awrap(getCommunityCards(game, 1));

        case 39:
          _card = _context10.sent;
          _cards2 = [game.communityCards[0], game.communityCards[1], game.communityCards[2], game.communityCards[3], _card[0]];
          _context10.next = 43;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              communityCards: _cards2
            }
          }));

        case 43:
          return _context10.abrupt("break", 67);

        case 44:
          if (!(game.players.length < 2)) {
            _context10.next = 48;
            break;
          }

          console.log('Not enough players to start game');
          _context10.next = 64;
          break;

        case 48:
          if (!(game.players.length >= 2)) {
            _context10.next = 64;
            break;
          }

          console.log('Starting game...'); // set the button

          _context10.next = 52;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              "players.$[].betAmount": null,
              "players.$[].waitingForRoundStart": false,
              "players.$[].isFolded": false,
              "players.$[].cards": []
            }
          }));

        case 52:
          buttonIndex = game.players.findIndex(function (player) {
            return player._id === game.button;
          });

          if (game.button === null) {
            game.button = game.players[0]._id; //TODO: make random
          } else {
            if (game.players.length === 2) {
              if (buttonIndex === 0) {
                game.button = game.players[1]._id;
                game.currentTurn = game.players[1]._id;
              } else {
                game.button = game.players[0]._id;
                game.currentTurn = game.players[0]._id;
              }
            } else if (game.players.length > 2) {
              if (buttonIndex === game.players.length - 1) {
                game.button = game.players[0]._id;
                game.currentTurn = game.players[1]._id;
              } else {
                game.button = game.players[buttonIndex + 1]._id;

                if (buttonIndex + 2 === game.players.length) {
                  game.currentTurn = game.players[0]._id;
                } else {
                  game.currentTurn = game.players[buttonIndex + 2]._id;
                }
              }
            }
          } // set the blinds


          if (game.players.length === 2) {
            smallBlindIndex = game.players.findIndex(function (player) {
              return player._id === game.button;
            });
            bigBlindIndex = smallBlindIndex + 1;
            if (bigBlindIndex === game.players.length) bigBlindIndex = 0;
            game.players[bigBlindIndex].hasBlinds = true;
            game.players[bigBlindIndex].betAmount = 2;
            game.players[smallBlindIndex].betAmount = 1;
          } else {
            _smallBlindIndex = game.players.findIndex(function (player) {
              return player._id === game.button;
            }) + 1;
            _bigBlindIndex = _smallBlindIndex + 2;
            if (_bigBlindIndex === game.players.length) _bigBlindIndex = 0;
            if (_bigBlindIndex === game.players.length + 1) _bigBlindIndex = 1;
            if (_smallBlindIndex === game.players.length) _smallBlindIndex = (_readOnlyError("smallBlindIndex"), 0);
            game.players[_bigBlindIndex].hasBlinds = true;
            game.players[_bigBlindIndex].betAmount = 2;
            game.players[_smallBlindIndex].betAmount = 1;
          }

          game.pot = 3;
          game.gameRound = 'preflop';
          _context10.next = 59;
          return regeneratorRuntime.awrap(game.save());

        case 59:
          _context10.next = 61;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 61:
          game = _context10.sent;
          _context10.next = 64;
          return regeneratorRuntime.awrap(giveEachPlayerCards(game));

        case 64:
          return _context10.abrupt("break", 67);

        case 65:
          console.error('Invalid game round' + game.gameRound);
          return _context10.abrupt("break", 67);

        case 67:
          _context10.next = 69;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 69:
          game = _context10.sent;
          playersLeft = checkIfPlayersActed(game);
          playersLeftInGame = [];

          for (_i2 = 0; _i2 < game.players.length; _i2++) {
            if (game.players[_i2].isFolded || game.players[_i2].waitingForRoundStart || game.players[_i2].connecting) playersLeftInGame.push(game.players[_i2]);
          }

          console.log(playersLeft.length);

          if (!(game.gameRound !== 'waiting' && playersLeft.length === 0 && playersLeftInGame !== 1)) {
            _context10.next = 103;
            break;
          }

          _context10.next = 77;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              "players.$[].betAmount": null,
              "players.$[].hasBlinds": false
            }
          }));

        case 77:
          _context10.t1 = game.gameRound;
          _context10.next = _context10.t1 === 'waiting' ? 80 : _context10.t1 === 'preflop' ? 82 : _context10.t1 === 'flop' ? 85 : _context10.t1 === 'turn' ? 88 : _context10.t1 === 'river' ? 91 : _context10.t1 === 'showdown' ? 94 : 97;
          break;

        case 80:
          console.error("Winning whilst waiting???");
          return _context10.abrupt("break", 99);

        case 82:
          _context10.next = 84;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              gameRound: 'flop'
            }
          }));

        case 84:
          return _context10.abrupt("break", 99);

        case 85:
          _context10.next = 87;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              gameRound: 'turn'
            }
          }));

        case 87:
          return _context10.abrupt("break", 99);

        case 88:
          _context10.next = 90;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              gameRound: 'river'
            }
          }));

        case 90:
          return _context10.abrupt("break", 99);

        case 91:
          _context10.next = 93;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              gameRound: 'showdown'
            }
          }));

        case 93:
          return _context10.abrupt("break", 99);

        case 94:
          _context10.next = 96;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              gameRound: 'waiting'
            }
          }));

        case 96:
          return _context10.abrupt("break", 99);

        case 97:
          console.error('Wrong GameRound ' + gameID.gameRound);
          return _context10.abrupt("break", 99);

        case 99:
          _context10.next = 101;
          return regeneratorRuntime.awrap(applyGameRules(gameID));

        case 101:
          _context10.next = 116;
          break;

        case 103:
          if (!(game.gameRound !== 'waiting' && (playersLeftInGame.length === 1 || game.gameRound === 'showdown'))) {
            _context10.next = 116;
            break;
          }

          _context10.next = 106;
          return regeneratorRuntime.awrap(handleWin(game));

        case 106:
          playerWon = _context10.sent;
          console.log("playerWon: " + playerWon);

          if (!playerWon) {
            _context10.next = 116;
            break;
          }

          _context10.t2 = console;
          _context10.next = 112;
          return regeneratorRuntime.awrap(Game.updateOne({
            _id: gameID
          }, {
            $set: {
              gameRound: 'waiting'
            }
          }));

        case 112:
          _context10.t3 = _context10.sent;

          _context10.t2.log.call(_context10.t2, _context10.t3);

          _context10.next = 116;
          return regeneratorRuntime.awrap(applyGameRules(gameID));

        case 116:
          _context10.next = 118;
          return regeneratorRuntime.awrap(Game.findById(gameID));

        case 118:
          return _context10.abrupt("return", _context10.sent);

        case 119:
        case "end":
          return _context10.stop();
      }
    }
  });
}

module.exports = {
  resetGames: resetGames,
  addPlayerToGame: addPlayerToGame,
  applyGameRules: applyGameRules,
  removePlayerFromGame: removePlayerFromGame,
  playerBet: playerBet,
  playerFold: playerFold
};