function formatDataForClient(data, playerID) {
    dataFormat = {
        players: [{
            name: "YOU",
            chips: 2000,
            cards: ["KH", "AH"],
            playerTurn: true,
            playerAction: "Small Blind: 1$",
            button: true,
        }
        ],
        pot: 0,
        board: [null, null, null, null, null],
        lastBet: 0,
    }
    let formattedData = {}
    if (!data) {
        return {};
    }
    formattedData.pot = data.pot;
    if (data.communityCards.length === 5) {
        formattedData.board = data.communityCards;
    } else {
        formattedData.board = [null, null, null, null, null];
    }
    formattedData.players = Array(data.players.length);
    for (let i = 0; i < data.players.length; i++) {
        formattedData.players[i] = {
            playerTurn: false,
        };
        formattedData.players[i].cards = new Array(2);

        if (data.players[i]._id === playerID) {
            formattedData.players[i].cards = data.players[i].cards;
        } else {
            formattedData.players[i].cards = [null, null]
        }
        if (data.currentTurn === data.players[i]._id) {
            formattedData.players[i].playerTurn = true;
        } else {
            formattedData.players[i].playerTurn = false;
        }
        if (data.players[i].betAmount >= 0) {
            formattedData.players[i].playerAction = data.players[i].betAmount;
        } else {
            formattedData.players[i].playerAction = null;
        }


        formattedData.players[i].chips = data.players[i].chips;
        formattedData.players[i].betAmount = data.players[i].betAmount;
        formattedData.players[i].name = "Player " + i.toString();
        formattedData.players[i].playerWaitingForRoundStart = data.players[i].waitingForRoundStart;
    }
    // console.log("formatted data: " + JSON.stringify(formattedData), "\nplayerID: " + playerID + "\n");
    return formattedData;
}

module.exports = {
    formatDataForClient,
}