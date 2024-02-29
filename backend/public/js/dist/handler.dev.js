"use strict";

var callBtn = document.getElementById("callBtn");
var raiseBtn = document.getElementById("raiseBtn");
var raiseInput = document.getElementById("raiseInput");
var foldBtn = document.getElementById("foldBtn");
var checkBtn = document.getElementById("checkBtn");
var betBtn = document.getElementById("betBtn");
var player1 = document.getElementById("playerPosition1");
var player2 = document.getElementById("playerPosition2");
var player3 = document.getElementById("playerPosition3");
var player4 = document.getElementById("playerPosition4");
var player5 = document.getElementById("playerPosition5");
var player6 = document.getElementById("playerPosition6");
var table = document.getElementsByClassName("table");
var potHtml = document.getElementById("pot-text");
var gameState = {
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
    isFolded: false,
    isAllIn: false,
    isSmallBlind: false,
    isBigBlind: false
  }],
  pot: 0,
  board: [null, null, null, null, null],
  controllerPlayerIndex: 0
};

function stopGame() {
  clearInterval(myInterval);
} // check what actions are possible


function getPossibleActions() {
  var possibeActions = [];
  var previousPlayerIndex = gameState.controllingPlayerIndex - 1;
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

      if (gameState.players[gameState.controllingPlayerIndex].chips > biggestBet - gameState.players[gameState.controllingPlayerIndex].betAmount) {
        possibeActions.push("raise");
      }
    }
  }

  return possibeActions;
}

function sendMessage(action) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var message = {
    data: {
      action: action,
      // "bet" / "fold"
      amount: amount,
      eventType: "playerAction"
    }
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
  var biggestBet = 0;

  for (var i = 0; i < gameState.players.length; i++) {
    if (gameState.players[i].betAmount > biggestBet) {
      biggestBet = gameState.players[i].betAmount;
    }
  }

  if (gameState.players[gameState.controllingPlayerIndex].betAmount) {
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
    var card = gameState.board[i];
    var cardHTML = document.getElementById("comm-card" + (i + 1).toString());
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
    var player = gameState.players[i];
    var playerHTML = document.getElementById("playerPosition" + (i + 1).toString());
    var playerNameHtml = playerHTML.querySelector(".player-info-wrapper").querySelector(".player-info").querySelector(".player-name");
    var playerActionHTML = playerHTML.querySelector(".player-info-wrapper").querySelector(".player-action");
    var playerChipCountHTML = playerHTML.querySelector(".player-info-wrapper").querySelector(".player-info").querySelector(".chip-count");
    var biggestBetExcludingActivePlayer = 0;

    for (var j = 0; j < gameState.players.length; j++) {
      if (i !== j) {
        if (gameState.players[j].betAmount > biggestBetExcludingActivePlayer) {
          biggestBetExcludingActivePlayer = gameState.players[j].betAmount;
        } //TODO: better way?

      }
    }

    playerChipCountHTML.textContent = player.chips.toString();
    var actionString = "";

    if (player.betAmount > 0) {
      actionString += "Bet: " + player.betAmount.toString() + "$";
    } else if (player.betAmount === 0) {
      actionString += "Check";
    } else if (player.betAmount > biggestBetExcludingActivePlayer) {
      actionString += "Raise: " + player.betAmount.toString() + "$";
    } else if (player.betAmount === biggestBetExcludingActivePlayer) {
      actionString += "Call" + player.betAmount.toString() + "$";
    } else if (player.folded) {
      actionString += "Fold";
    } else if (player.allIn) {
      actionString += "All In";
    } else if (player.isBigBlind) {
      actionString += "Big Blind: " + player.betAmount.toString() + "$";
    } else if (player.isSmallBlind) {
      actionString += "Small Blind: " + player.betAmount.toString() + "$";
    } else if (player.playerTurn === false) {
      actionString += "Waiting";
    } else if (player.playerTurn === true) {
      actionString += "Your Turn";
    }

    if (player.playerAction) {
      playerActionHTML.textContent = actionString;
    } else {
      playerActionHTML.textContent = "";
    }

    playerHTML.classList.remove("hidden");
    playerHTML.querySelector(".player-info-wrapper").classList.remove("waiting");
    playerNameHtml.textContent = player.name;
    var card1HTML = playerHTML.querySelector("div").querySelector("#card1").querySelector("img");
    var card2HTML = playerHTML.querySelector("div").querySelector("#card2").querySelector("img");
    card1HTML.classList.remove("hidden");
    card2HTML.classList.remove("hidden");

    if (player.cards[0] == null || player.cards[1] == null) {
      card1HTML.src = "assets/cards/back@2x.png";
      card2HTML.src = "assets/cards/back@2x.png";
    } else if (player.cards[0] != null && player.cards[1] != null) {
      card1HTML.src = "assets/cards/" + player.cards[0] + ".png";
      card2HTML.src = "assets/cards/" + player.cards[1] + ".png";
    }

    if (player.playerTurn) {
      playerHTML.querySelector(".player-info-wrapper").classList.add("active");
    } else {
      playerHTML.querySelector(".player-info-wrapper").classList.remove("active");
    }

    if (player.playerWaitingForRoundStart) {
      playerHTML.querySelector(".player-info-wrapper").classList.add("waiting");
      card1HTML.classList.add("hidden");
      card2HTML.classList.add("hidden");
    } // if (player.button) {
    //     table.querySelector(".player-button").style.transform = 'rotate(' + i * 45 + 'deg)';
    // }

  }

  for (var i = gameState.players.length; i <= 5; i++) {
    var _playerHTML = document.getElementById("playerPosition" + (i + 1).toString());

    _playerHTML.classList.add("hidden");
  }
}

function mainLoop() {
  // check what actions are possible
  for (var i = 0; i < gameState.players.length; i++) {
    var possibleActions = getPossibleActions();
    updateButtons(possibleActions);
    updateTable();
  }
}

var myInterval = setInterval(mainLoop, 1000);
var socket = new WebSocket('ws://192.168.178.75:7071', 'echo-protocol');
socket.addEventListener('open', function () {
  console.log('Connected to WebSocket server');
});
socket.addEventListener('message', function (message) {
  var parsedData = JSON.parse(message.data);
  console.log('Message from server:', message.data);

  switch (parsedData.eventType) {
    case "updateGameState":
      if (parsedData) {
        gameState = parsedData.data;
      }

      var possibleActions = getPossibleActions();
      updateButtons(possibleActions);
      updateTable();
      break;

    case "gameOver":
      // stopGame();
      break;

    default:
      console.error("unknown event ", message.data);
  }

  console.log(parsedData);
});
socket.addEventListener('close', function () {
  console.log('Disconnected from WebSocket server');
});
socket.addEventListener('error', function (error) {
  console.error('WebSocket error:', error);
});