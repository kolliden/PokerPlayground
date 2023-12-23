const Game = require('../models/game');
const { showdown } = require('../utils/handSolver');

async function resetGames() {
    try {
        await Game.updateMany({}, { $set: { players: [], gameRound: "waiting", pot: 0, communityCards: [null, null, null, null, null], remainingCardDeck: [] } });
    } catch (err) {
        console.error(err);
    }
}

async function removePlayerFromGame(gameID, playerID) {
    try {
        const game = await Game.findById(await gameID);

        if (!game) {
            console.error('Game not found ' + gameID, " player: " + playerID);
            return;
        }
        // Remove player from game
        const updateResult = await Game.updateOne({ _id: gameID }, { $pull: { players: { _id: playerID } } });
        if (!updateResult.modifiedCount > 0) {
            console.error('Player error while removing from game: ' + playerID);
        }

    } catch (err) {
        console.error('Error removing player from game:', err);
    }
}

async function addPlayerToGame(playerID) {
    try {
        //find game with playerarray less than 5
        const availableGames = await Game.find({ $where: 'this.players.length <= 5' });
        if (availableGames.length > 0) {
            const playersGame = await Game.updateOne({ _id: availableGames[0]._id }, { $push: { players: { _id: playerID, waitingForRoundStart: true } } });
            return await Game.findById(availableGames[0]._id);
        } else {
            const newGame = await Game.create({ players: [{ _id: playerID, waitingForRoundStart: true }] });
            return newGame;
        }
    } catch (err) {
        console.error('Error finding or creating game:', err);
    }
}

async function giveEachPlayerCards(game, numberOfCards = 2) {
    try {
        let possibleCards = [];

        if (game.remainingCardDeck.length > numberOfCards * game.players.length) {
            possibleCards = game.remainingCardDeck;
        } else {
            possibleCards = ["2C", "2D", "2H", "2S", "3C", "3D", "3H", "3S", "4C", "4D", "4H", "4S", "5C", "5D", "5H", "5S", "6C", "6D", "6H", "6S", "7C", "7D", "7H", "7S", "8C", "8D", "8H", "8S", "9C", "9D", "9H", "9S", "TC", "TD", "TH", "TS", "JC", "JD", "JH", "JS", "QC", "QD", "QH", "QS", "KC", "KD", "KH", "KS", "AC", "AD", "AH", "AS",];
        }

        let usedCards = [];

        for (let i = 0; i < game.players.length; i++) {
            if (game.players[i].cards.length > 0) {
                console.error('Player already has cards');
                return;
            }
            for (let j = 0; j < numberOfCards; j++) {
                let card = possibleCards[Math.floor(Math.random() * possibleCards.length)];
                while (usedCards.includes(card)) {
                    card = possibleCards[Math.floor(Math.random() * possibleCards.length)];
                }
                usedCards.push(card);
                game.players[i].cards.push(card);
            }
        }

        game.remainingCardDeck = possibleCards.filter((card) => !usedCards.includes(card));
        await game.save();
    } catch (err) {
        console.error('Error giving cards to players:', err);
    }
}

async function getCommunityCards(game, numberOfCards) {
    let possibleCards = [];

    if (game.remainingCardDeck.length > numberOfCards) {
        possibleCards = game.remainingCardDeck;
    } else {
        possibleCards = ["2C", "2D", "2H", "2S", "3C", "3D", "3H", "3S", "4C", "4D", "4H", "4S", "5C", "5D", "5H", "5S", "6C", "6D", "6H", "6S", "7C", "7D", "7H", "7S", "8C", "8D", "8H", "8S", "9C", "9D", "9H", "9S", "TC", "TD", "TH", "TS", "JC", "JD", "JH", "JS", "QC", "QD", "QH", "QS", "KC", "KD", "KH", "KS", "AC", "AD", "AH", "AS",];
    }

    let finalCards = [];
    let usedCards = [];

    for (let j = 0; j < numberOfCards; j++) {
        let card = possibleCards[Math.floor(Math.random() * possibleCards.length)];
        while (usedCards.includes(card)) {
            card = possibleCards[Math.floor(Math.random() * possibleCards.length)];
        }
        usedCards.push(card);
        finalCards.push(card);
    }

    game.remainingCardDeck = possibleCards.filter((card) => !usedCards.includes(card));
    await game.save();

    return finalCards;
}

async function advanceTurn(gameID) {
    let game = await Game.findById(gameID);
    const playerIndex = game.players.findIndex((player) => player._id === game.currentTurn);

    let newPlayerIndex = 0;
    // find index of current turn player
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

    game.currentTurn = game.players[newPlayerIndex]._id;

    // console.log('New turn: ' + game.players[newPlayerIndex]);

    await game.save();
}

async function playerFold(gameID, playerID) {
    try {
        let game = await Game.findById(gameID);
        const playerIndex = game.players.findIndex((player) => player._id === playerID);

        if (!game) {
            console.error('Game or player not found');
            return;
        }
        game.players[playerIndex].isFolded = true;
        game.players[playerIndex].betAmount = null;

        await advanceTurn(gameID);

        await game.save();
        await applyGameRules(gameID);
    } catch (err) {
        console.error('Error folding:', err);
    }
}

async function playerBet(gameID, playerID, betAmount) {
    try {
        let game = await Game.findById(gameID);
        const playerIndex = game.players.findIndex((player) => player._id === playerID);
        if (betAmount === null) betAmount = 0;
        // console.log(playerIndex, playerID, game);
        if (!game) {
            console.error('Game not found');
            return game;
        }
        // console.log('gameTurn: ' + game.currentTurn, 'playerID: ' + playerID);
        if (game.currentTurn !== playerID) {
            console.error('Not your turn');
            return game;
        }
        if (game.players[playerIndex].isFolded) {
            console.error('Player is folded');
        }
        let biggestBet = 0;
        for (var i = 0; i < game.players.length; i++) {
            if (game.players[i].betAmount > biggestBet) {
                biggestBet = game.players[i].betAmount;
            }
        }
        if (betAmount < biggestBet && (betAmount + game.players[playerIndex].betAmount) < biggestBet) {
            console.error('Bet amount too small');
            return game;
        }
        if (betAmount > game.players[playerIndex].chips) {
            console.error('Not enough chips');
            return game;
        } else {
            if (game.players[playerIndex].betAmount) {
                game.players[playerIndex].betAmount += parseInt(betAmount);
            } else {
                game.players[playerIndex].betAmount = parseInt(betAmount);
            }
            game.players[playerIndex].chips -= parseInt(betAmount);
            game.pot = parseInt(betAmount) + parseInt(game.pot);

            await advanceTurn(gameID);

            await game.save()
            return await Game.findById(gameID);
        }
    }
    catch (err) {
        console.error('Error betting:', err);
    }
}

// function parseCards(players) {
//     //[ [ '8H', '3S' ], [ '3H', 'TC' ] ] to [[[8, 'H'], [3, 'S']], [[3, 'H'], [10, 'C']]]
// }
function parseCards(cards) {
    return cards.map(hand =>
        hand.map(card => [
            getValue(card.slice(0, -1)), // Get numeric value
            card.slice(-1) // Get suit
        ])
    );
}

function getValue(valueStr) {
    const valueMap = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };
    return valueMap[valueStr];
}

function parseCommunityCards(communityCards) {
    let newCards = [];
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
    console.log(newCards)
    return newCards;
}

function checkIfPlayersActed(game) {
    let playersLeft = [];
    let biggestBet = 0;
    console.log('Checking if all players acted');
    console.log("Amount of players to be checked:" + game.players.length);
    for (var i = 0; i < game.players.length; i++) {
        if (game.players[i].betAmount > biggestBet) {
            biggestBet = game.players[i].betAmount;
        }
    }
    let amountOfPLayersLeft = 0;

    for (var i = 0; i < game.players.length; i++) {
        // console.log('Biggest bet: ' + biggestBet + ' \n' + game.players[i].isFolded + ' \n' + game.players[i].isAllIn + ' \n' + game.players[i].waitingForRoundStart + ' \n' + game.players[i].connecting, ' \n' + game.players[i].betAmount + ' \n' + game.players[i].hasBlinds + ' \n' + game.players[i].betAmount === 2, ' \n' + game.players[i].betAmount === biggestBet, ' \n');
        if (game.players[i].isFolded ||
            game.players[i].isAllIn ||
            game.players[i].waitingForRoundStart ||
            game.players[i].connecting) {
            console.log('players acted ' + i);
        } else if (
            game.players[i].betAmount !== biggestBet ||
            game.players[i].hasBlinds && game.players[i].betAmount === 2
        ) {
            console.log('player has not acted ' + i);
            playersLeft.push(game.players[i]);
            amountOfPLayersLeft++;
        }
    }
    return playersLeft;
}

async function handleWin(game) {
    console.log('Checking for winning players');
    let playersLeft = [];
    for (let i = 0; i < game.players.length; i++) {
        if (!game.players[i].isFolded && !game.players[i].waitingForRoundStart && !game.players[i].connecting) playersLeft.push(game.players[i]);
    }
    if (game.gameRound !== 'showdown') {
        if (playersLeft.length === 1) {
            let winnerIndex = game.players.findIndex((player) => player._id === playersLeft[0]._id);

            console.log('Winner: ' + game.players[winnerIndex], "won: " + game.pot + " chips");

            game.players[winnerIndex].chips += game.pot;
            game.pot = 0;
            await game.save();

            return game.players[winnerIndex];
        } else {
            return false;
        }
    } else if (game.gameRound === 'showdown') {
        let playerCards = [];
        for (var i = 0; i < playersLeft.length; i++) {
            playerCards.push(playersLeft[i].cards);
        }
        let [winnerIndex, PlayersHandsValue] = showdown(parseCards(playerCards), parseCommunityCards(game.communityCards));
        let winner = game.players[winnerIndex];

        game.players[winnerIndex].chips += game.pot;
        console.log('Winner: ' + winner, "won: " + game.pot + " chips");
        game.pot = 0;
        await game.save();
        return winner;
    }
}

async function applyGameRules(gameID) {
    let game = await Game.findById(gameID);
    // console.log('game is ===== '+ game);
    console.log('Applying game rules to game ' + gameID);
    if (!game) {
        console.error('Game not found');
        return;
    }
    let nullCount = 0;

    for (var i = 0; i < game.communityCards.length; i++) {
        if (game.communityCards[i] === null) {
            nullCount++;
        }
    }

    // Set community cards
    switch (game.gameRound) {
        case 'preflop':
            console.log('Preflop');
            if (nullCount !== 5) {
                await Game.updateOne({ _id: gameID }, { $set: { communityCards: [null, null, null, null, null] } });
            }
            break;
        case 'flop':
            console.log('Flop');
            if (nullCount === 5) {
                let cards = await getCommunityCards(game, 3);
                cards.push(null);
                cards.push(null);
                await Game.updateOne({ _id: gameID }, { $set: { communityCards: cards } });
            }
            break;
        case 'turn':
            let cards = [];
            if (nullCount === 2) {
                let card = await getCommunityCards(game, 1);
                cards = [game.communityCards[0], game.communityCards[1], game.communityCards[2], card[0], null];

                await Game.updateOne({ _id: gameID }, { $set: { communityCards: cards } });
            }
            break;
        case 'river':
            if (nullCount === 1) {
                let card = await getCommunityCards(game, 1);
                let cards = [game.communityCards[0], game.communityCards[1], game.communityCards[2], game.communityCards[3], card[0]];

                await Game.updateOne({ _id: gameID }, { $set: { communityCards: cards } });
            }

            break;
        case 'waiting':
            if (game.players.length < 2) {
                console.log('Not enough players to start game');
            } else if (game.players.length >= 2) {
                console.log('Starting game...');
                // set the button
                await Game.updateOne({ _id: gameID }, { $set: { "players.$[].betAmount": null, "players.$[].waitingForRoundStart": false, "players.$[].isFolded": false, "players.$[].cards": [] } });

                const buttonIndex = game.players.findIndex((player) => player._id === game.button);

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
                }
                // set the blinds
                if (game.players.length === 2) {
                    let smallBlindIndex = game.players.findIndex((player) => player._id === game.button);
                    let bigBlindIndex = smallBlindIndex + 1;
                    if(bigBlindIndex === game.players.length) bigBlindIndex = 0;

                    game.players[bigBlindIndex].hasBlinds = true;
                    game.players[bigBlindIndex].betAmount = 2;
                    game.players[smallBlindIndex].betAmount = 1;
                } else {
                    let smallBlindIndex = game.players.findIndex((player) => player._id === game.button) + 1;
                    let bigBlindIndex = smallBlindIndex + 1;
                    if(bigBlindIndex === game.players.length) bigBlindIndex = 0;
                    if(bigBlindIndex === game.players.length + 1) bigBlindIndex = 1;
                    if(smallBlindIndex === game.players.length) smallBlindIndex = 0;

                    console.log("smallBlindIndex: " + smallBlindIndex + " bigBlindIndex: " + bigBlindIndex);

                    game.players[bigBlindIndex].hasBlinds = true;
                    game.players[bigBlindIndex].betAmount = 2;
                    game.players[smallBlindIndex].betAmount = 1;
                }

                game.pot = 3;
                game.gameRound = 'preflop';

                await game.save();
                game = await Game.findById(gameID);
                await giveEachPlayerCards(game);
            }
            break;

        default:
            console.error('Invalid game round: ' + game.gameRound);
            break;
    }

    game = await Game.findById(gameID);
    let playersLeft = checkIfPlayersActed(game);
    let playersLeftInGame = [];

    for (let i = 0; i < game.players.length; i++) {
        if (!game.players[i].isFolded && !game.players[i].waitingForRoundStart && !game.players[i].connecting) playersLeftInGame.push(game.players[i]);
    }
    console.log(playersLeft.length);

    if (game.gameRound !== 'waiting' && playersLeft.length === 0 && playersLeftInGame !== 1) {
        await Game.updateOne({ _id: gameID }, { $set: { "players.$[].betAmount": null, "players.$[].hasBlinds": false } });
        switch (game.gameRound) {
            case 'waiting':
                console.error("Winning whilst waiting???");
                break;
            case 'preflop':
                await Game.updateOne({ _id: gameID }, { $set: { gameRound: 'flop', } });
                break;
            case 'flop':
                await Game.updateOne({ _id: gameID }, { $set: { gameRound: 'turn' } });
                break;
            case 'turn':
                await Game.updateOne({ _id: gameID }, { $set: { gameRound: 'river' } });
                break;
            case 'river':
                await Game.updateOne({ _id: gameID }, { $set: { gameRound: 'showdown' } });
                break;
            case 'showdown':
                await Game.updateOne({ _id: gameID }, { $set: { gameRound: 'waiting' } });
                break;
            default:
                console.error('Wrong GameRound ' + gameID.gameRound);
                break;
        }
        await applyGameRules(gameID);
    } else if (game.gameRound !== 'waiting' && (playersLeftInGame.length === 1 || game.gameRound === 'showdown')) {
        let playerWon = await handleWin(game);
        if (playerWon) {
            await Game.updateOne({ _id: gameID }, { $set: { gameRound: 'waiting' } });
            await applyGameRules(gameID);
        }
    }

    return await Game.findById(gameID);
}


module.exports = {
    resetGames,
    addPlayerToGame,
    applyGameRules,
    removePlayerFromGame,
    playerBet,
    playerFold,
};
