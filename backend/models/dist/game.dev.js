"use strict";

var mongoose = require('mongoose');

var _require = require('uuid'),
    uuid = _require.v4; // Game schema


var gameSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    "default": function _default() {
      return uuid();
    }
  },
  players: [{
    _id: {
      type: String,
      required: true
    },
    cards: [String],
    hasBlinds: {
      type: Boolean,
      "default": false
    },
    betAmount: {
      type: Number || null,
      // null means not yet bet
      "default": undefined
    },
    chips: {
      type: Number,
      "default": 2000
    },
    isFolded: {
      type: Boolean,
      "default": false
    },
    isAllIn: Boolean,
    waitingForRoundStart: {
      type: Boolean,
      "default": true
    },
    connecting: {
      type: Boolean,
      "default": false
    }
  }],
  communityCards: [String],
  remainingCardDeck: [String],
  currentTurn: String,
  button: String,
  pot: {
    type: Number,
    "default": 0
  },
  gameState: {
    type: String,
    "enum": ['in_progress', 'finished', 'cancelled'],
    // Enum for game states
    "default": 'in_progress'
  },
  gameRound: {
    type: String,
    "enum": ['waiting', 'preflop', 'flop', 'turn', 'river', 'showdown'],
    // Enum for game rounds
    "default": 'waiting'
  }
});
var Game = mongoose.model('Game', gameSchema);
module.exports = Game;