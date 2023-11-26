const gameID = 1; // Example game ID
const socket = new WebSocket(`ws://localhost:8080/`, );

//connect websocket


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
// console.log("table: " + table);

let gameState = {
    players: [{
        playerID: 9999,
        name: "YOU",
        chips: 2000,
        cards: ["KH", "AH"],
        playerTurn: true,
        playerAction: "Small Blind: 1$",
        button: true,
    }, {
        playerID: 9999,
        name: "Poker God1224",
        chips: 2000,
        cards: [null,null],
        playerTurn: false,
        playerAction: "Big Blind: 2$",
        button: false,
    },
    {
        playerID: 9999,
        name: "FishOfPoker",
        chips: 2000,
        cards: [null,null],
        playerTurn: false,
        playerAction: "Bet: 4.5$",
        button: false,
    },
    {
        playerID: 9999,
        name: "MegaShark",
        chips: 2000,
        cards: [null,null],
        playerTurn: false,
        playerAction: "Fold",
        button: false,
    }, {
        playerID: 9999,
        name: "WinnerWinner",
        chips: 2000,
        cards: [null,null],
        playerTurn: false,
        playerAction: "call 4.5$",
        button: false,
    }, {
        playerID: 9999,
        name: "Runner6000",
        chips: 2000,
        cards: [null,null],
        playerTurn: false,
        playerAction: "Raise: 9$",
        button: false,
    }
    ],
    pot: 0,
    board: ["AD", "AC", "TH", null, null],
    lastBet: 0,
}

function stopGame() {
    clearInterval(myInterval);
}
// check what actions are possible
function getPossibleActions() {
    let possibeActions = [];
    if (gameState.players[0].playerTurn) {
        if (gameState.lastBet == 0) {
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

function sendMessage(action, amount = 0 ){
    const message = {
        playerID: playerID,
        action: action, // "bet" / "fold"
        amount: amount,
    };
        if (socket.readyState === WebSocket.OPEN) {

            socket.send(JSON.stringify(message));        } else {
            console.warn("websocket is not connected");
        }

}

function fold() {
    sendMessage("fold");
}

function call() {
    sendMessage("bet", gameState.lastBet);
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
        let cardHTML = document.getElementById("comm-card" + (i+1).toString());
        cardHTML.classList.remove("hidden");
        if (card == null) {
            cardHTML.classList.add("hidden");
        }   else {
            cardHTML.classList.remove("hidden");
        cardHTML.src = "assets/cards/" + card + ".png";

        }
    }


    let card1HTML = document.getElementById("active-playercard1");
    let card2HTML = document.getElementById("active-playercard2");

    // print(gameState.players[0].cards[0])
    // print(gameState.players[0].cards[1])

    card1HTML.classList.remove("hidden");
    card2HTML.classList.remove("hidden");
    card1HTML.src = "assets/cards/" + gameState.players[0].cards[0] + ".png";
    card2HTML.src = "assets/cards/" + gameState.players[0].cards[1] + ".png";

    for (var i = 0; i < gameState.players.length; i++) {
        let player = gameState.players[i];
        let playerHTML = document.getElementById("playerPosition" + (i + 1).toString());
        let playerNameHtml = playerHTML.querySelector(".player-info-wrapper").querySelector(".player-info").querySelector(".player-name");
        playerHTML.classList.remove("hidden");

        playerNameHtml.textContent = player.name;

        playerHTML.querySelector(".player-info-wrapper").querySelector(".player-action").textContent = player.playerAction;

        if (player.playerTurn) {
            playerHTML.querySelector(".player-info-wrapper").classList.add("active");
        } else {
            playerHTML.querySelector(".player-info-wrapper").classList.remove("active");
        }
        // if (player.button) {
        //     table.querySelector(".player-button").style.transform = 'rotate(' + i * 45 + 'deg)';
        // }

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

// // Fetch example to get all games
// fetch('/api/games/')
//     .then(response => response.json())
//     .then(data => {
//         // Handle retrieved game data
//         console.log(data);
//     })
//     .catch(error => {
//         // Handle error
//         console.error('Error:', error);
//     });

// Fetch example to create a new game
// fetch('/api/games/', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(newGame),
// })
// .then(response => response.json())
// .then(data => {
//   // Handle created game data
//   console.log(data);
// })
// .catch(error => {
//   // Handle error
//   console.error('Error:', error);
// });

socket.onopen = () => {
    console.log('WebSocket connected');
};

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Handle incoming WebSocket data
    console.log('Received data:', data);

    // Handle WebSocket data
    console.log('Received data:', data);
};

let playerID = 1
// Sending a message through WebSocket
sendMessage("join", playerID);