const callBtn = document.getElementById("callBtn");
const raiseBtn = document.getElementById("raiseBtn");
const raiseInput = document.getElementById("raiseInput");
const foldBtn = document.getElementById("foldBtn");
const checkBtn = document.getElementById("checkBtn");
const betBtn = document.getElementById("betBtn");

const player1 = document.getElementById("playerPosition1");
const player2 = document.getElementById("playerPosition2");
const player3 = document.getElementById("playerPosition3");
const player4 = document.getElementById("playerPosition4");
const player5 = document.getElementById("playerPosition5");
const player6 = document.getElementById("playerPosition6");

const table = document.getElementsByClassName("table");
const potHtml = document.getElementById("pot-text");

let gameState = {
    players: [{
        name: "YOU",
        chips: 2000,
        cards: ["KH", "AH"],
        playerTurn: true,
        playerAction: "Small Blind: 1$",
        button: true,
        betAmount: 1,
        playerConnecting: false,
        playerWaitingForRoundStart: false,
    }],
    pot: 0,
    board: [null, null, null, null, null],
    controllerPlayerIndex:0,
}

function stopGame() {
    clearInterval(myInterval);
}
// check what actions are possible
function getPossibleActions() {
    let possibeActions = [];
    let previousPlayerIndex = gameState.controllingPlayerIndex - 1;
    if (previousPlayerIndex === -1) previousPlayerIndex = gameState.players.length - 1;

    biggestBet = 0;
    for (var i = 0; i < gameState.players.length; i++) {
        if (gameState.players[i].betAmount > biggestBet) {
            biggestBet = gameState.players[i].betAmount;
        }
    }

    if (gameState.players[gameState.controllingPlayerIndex].playerTurn) {
        if (!biggestBet && !gameState.players[gameState.controllingPlayerIndex].betAmount || gameState.players[gameState.controllingPlayerIndex].betAmount === gameState.players[previousPlayerIndex].betAmount || gameState.players[previousPlayerIndex].betAmount === 0) {
            possibeActions.push("check");
            possibeActions.push("bet");
        } else {
            possibeActions.push("fold");
            possibeActions.push("call");
            possibeActions.push("raise");
        }
    }
    return possibeActions;
}

function sendMessage(action, amount = 0) {
    const message = {
        data: {
            action: action, // "bet" / "fold"
            amount: amount,
            eventType: "playerAction",
        },
    };
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.warn("websocket is not connected");
    }
}

function fold() {
    sendMessage("fold");
}

function call() {
    let biggestBet = 0;
    for (var i = 0; i < gameState.players.length; i++) {
        if (gameState.players[i].betAmount > biggestBet) {
            biggestBet = gameState.players[i].betAmount;
        }
    }
    if (gameState.players[gameState.controllingPlayerIndex].betAmount){
        sendMessage("bet", biggestBet - gameState.players[gameState.controllingPlayerIndex].betAmount);
    } else {
        sendMessage("bet", biggestBet);
    }
}

function check() {
    sendMessage("bet");
}

function raise() {
    sendMessage("bet", raiseInput.value);
}

function bet() {
    sendMessage("bet", raiseInput.value);
}

function updateButtons(possibeActions) {

    if (possibeActions.includes("fold")) {
        foldBtn.classList.remove("hidden");
    } else {
        foldBtn.classList.add("hidden");
    }
    if (possibeActions.includes("check")) {
        checkBtn.classList.remove("hidden");
    } else {
        checkBtn.classList.add("hidden");
    }
    if (possibeActions.includes("call")) {
        callBtn.classList.remove("hidden");
    } else {
        callBtn.classList.add("hidden");
    }
    if (possibeActions.includes("raise")) {
        raiseBtn.classList.remove("hidden");
        raiseInput.classList.remove("hidden");
    } else {
        raiseBtn.classList.add("hidden");
        raiseInput.classList.add("hidden");
    }
    if (possibeActions.includes("bet")) {
        betBtn.classList.remove("hidden");
        raiseInput.classList.remove("hidden");
    } else {
        betBtn.classList.add("hidden");
    }
}

function updateTable() {
    for (var i = 0; i <= 4; i++) {
        let card = gameState.board[i];
        let cardHTML = document.getElementById("comm-card" + (i + 1).toString());
        potHtml.textContent = gameState.pot;

        cardHTML.classList.remove("hidden");
        if (card == null) {
            cardHTML.classList.add("hidden");
        } else {
            cardHTML.classList.remove("hidden");
            cardHTML.src = "assets/cards/" + card + ".png";

        }
    }

    for (var i = 0; i < gameState.players.length; i++) {
        const player = gameState.players[i];
        const playerHTML = document.getElementById("playerPosition" + (i + 1).toString());
        const playerNameHtml = playerHTML.querySelector(".player-info-wrapper").querySelector(".player-info").querySelector(".player-name");
        const playerActionHTML = playerHTML.querySelector(".player-info-wrapper").querySelector(".player-action");
        const playerChipCountHTML = playerHTML.querySelector(".player-info-wrapper").querySelector(".player-info").querySelector(".chip-count");

        playerChipCountHTML.textContent = player.chips.toString();
        if (player.playerAction){
            playerActionHTML.textContent = player.playerAction.toString();
        } else {
            playerActionHTML.textContent = "";
        }

        playerHTML.classList.remove("hidden");
        playerHTML.querySelector(".player-info-wrapper").classList.remove("waiting");

        playerNameHtml.textContent = player.name;

        let card1HTML = playerHTML.querySelector("div").querySelector("#card1").querySelector("img");
        let card2HTML = playerHTML.querySelector("div").querySelector("#card2").querySelector("img");
        card1HTML.classList.remove("hidden");
        card2HTML.classList.remove("hidden");

        if (player.cards[0] == null || player.cards[1] == null) {
            card1HTML.src = "assets/cards/back@2x.png";
            card2HTML.src = "assets/cards/back@2x.png";
        } else if (player.cards[0] != null && player.cards[1] != null) {
            card1HTML.src = "assets/cards/" + player.cards[0] + ".png";
            card2HTML.src = "assets/cards/" + player.cards[1] + ".png";
        }

        playerHTML.querySelector(".player-info-wrapper").querySelector(".player-action").textContent = player.playerAction;

        if (player.playerTurn) {
            playerHTML.querySelector(".player-info-wrapper").classList.add("active");
        } else {
            playerHTML.querySelector(".player-info-wrapper").classList.remove("active");
        }

        if (player.playerWaitingForRoundStart){
            playerHTML.querySelector(".player-info-wrapper").classList.add("waiting");
            card1HTML.classList.add("hidden");
            card2HTML.classList.add("hidden");
        }
        // if (player.button) {
        //     table.querySelector(".player-button").style.transform = 'rotate(' + i * 45 + 'deg)';
        // }

    }
    for (var i = gameState.players.length; i <= 5; i++) {
        const playerHTML = document.getElementById("playerPosition" + (i + 1).toString());
        playerHTML.classList.add("hidden");
    }

}


function mainLoop() {
    // check what actions are possible
    for (var i = 0; i < gameState.players.length; i++) {
        let possibleActions = getPossibleActions();
        updateButtons(possibleActions);
        updateTable();
    }
}


var myInterval = setInterval(mainLoop, 1000);

const socket = new WebSocket('ws://localhost:7071', 'echo-protocol');

socket.addEventListener('open', () => {
    console.log('Connected to WebSocket server');
});

socket.addEventListener('message', (message) => {
    const parsedData = JSON.parse(message.data)
    console.log('Message from server:', message.data);
    switch (parsedData.eventType) {
        case "updateGameState":
            if (parsedData) {
                gameState = parsedData.data;
            }
            break;
        case "gameOver":
            // stopGame();
            break;
        default:
            console.error("unknown event ", message.data);
    }
    console.log(parsedData)
});

socket.addEventListener('close', () => {
    console.log('Disconnected from WebSocket server');
});

socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
}
);