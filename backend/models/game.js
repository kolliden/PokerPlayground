const mongoose = require('mongoose');
const { v4 : uuid }= require('uuid');

// Game schema
const gameSchema = new mongoose.Schema({
    _id: { type: String, required: true, default: () => uuid() },
    players: [
        {
            _id: { type: String, required: true },
            name: { type: String, default: 'Player' },
            cards: [String],
            hasBlinds: {
                type: Boolean,
                default: false,
            },
            betAmount: {
                type: Number || null, // null means not yet bet
                default: undefined,
            },
            chips: {type: Number,  default: 100},
            isFolded: {
                type: Boolean,
                default: false,
            },
            isAllIn: Boolean,
            waitingForRoundStart: {
                type: Boolean,
                default: true,
            },
            connecting: {
                type: Boolean,
                default: false,
            },
        },
    ],
    handTypes: [{
        type: String,
        default: "High Card",
    }],
    communityCards: [String],
    remainingCardDeck: [String],
    currentTurn: String,
    button: String,
    pot: {
        type: Number,
        default: 0,
    },
    gameState: {
        type: String,
        enum: ['in_progress', 'finished', 'cancelled'], // Enum for game states
        default: 'in_progress',
    },
    gameRound: {
        type: String,
        enum: ['waiting', 'preflop', 'flop', 'turn', 'river', 'showdown'], // Enum for game rounds
        default: 'waiting',
    },
    gameMessages: [
        {
            message: String,
            sender: String,
        },
    ],
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
