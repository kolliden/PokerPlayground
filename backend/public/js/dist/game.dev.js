"use strict";

var callBtn = document.getElementById("callBtn");
var raiseBtn = document.getElementById("raiseBtn");
var raiseInput = document.getElementById("raiseInputField");
var raiseInputWrapper = document.getElementById("raiseInput");
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
var messageInput = document.getElementById("game-message-input");
var buttonImg = document.createElement("img");
buttonImg.src = "assets/dealer-button.png";
buttonImg.classList.add("dealer-button");
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
  }, {
    name: "YOU",
    chips: 2000,
    cards: ["KS", "AS"],
    playerTurn: false,
    playerAction: "Small Blind: 1$",
    button: true,
    betAmount: 1,
    playerConnecting: false,
    playerWaitingForRoundStart: false,
    isFolded: true,
    isAllIn: false,
    isSmallBlind: false,
    isBigBlind: false
  }],
  pot: 0,
  board: [null, null, null, null, null],
  controllingPlayerIndex: 0
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
    raiseInputWrapper.querySelectorAll("button").forEach(function (button) {
      button.classList.remove("hidden");
    });
  } else {
    raiseBtn.classList.add("hidden");
    raiseInput.classList.add("hidden");
    raiseInputWrapper.querySelectorAll("button").forEach(function (button) {
      button.classList.add("hidden");
    });
  }

  if (possibeActions.includes("bet")) {
    raiseInputWrapper.querySelectorAll("button").forEach(function (button) {
      button.classList.remove("hidden");
    });
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
      actionString = "Bet: " + player.betAmount.toString() + "$";
    }

    if (player.betAmount === 0) {
      actionString = "Check";
    }

    if (player.betAmount > biggestBetExcludingActivePlayer) {
      actionString = "Raise: " + player.betAmount.toString() + "$";
    }

    if (player.betAmount === biggestBetExcludingActivePlayer) {
      actionString = "Call" + player.betAmount.toString() + "$";
    }

    if (player.isFolded) {
      actionString = "Fold";
    }

    if (player.isAllIn) {
      actionString = "All In";
    }

    if (player.isBigBlind) {
      actionString = "Big Blind: " + player.betAmount.toString() + "$";
    }

    if (player.isSmallBlind) {
      actionString = "Small Blind: " + player.betAmount.toString() + "$";
    }

    if (!actionString && player.playerTurn === false) {
      actionString = "Waiting";
    }

    if (!actionString && player.playerTurn === true) {
      actionString = "Your Turn";
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

    if (player.button) {
      // add img to div
      playerHTML.querySelector(".player-info-wrapper").appendChild(buttonImg);
    } else {
      // remove img from div
      if (playerHTML.querySelector(".player-info-wrapper").contains(buttonImg)) {
        playerHTML.querySelector(".player-info-wrapper").removeChild(buttonImg);
      }
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

function raiseInputByOne() {
  if (raiseInput.value === "") raiseInput.value = 1;
  raiseInput.value = parseInt(raiseInput.value) + 1;
}

function decreaseInputByOne() {
  if (raiseInput.value > 0) {
    raiseInput.value = parseInt(raiseInput.value) - 1;
  }
}

function thirdPot() {
  raiseInput.value = parseInt(gameState.pot / 3);
}

function halfPot() {
  raiseInput.value = parseInt(gameState.pot / 2);
}

function allIn() {
  raiseInput.value = gameState.players[gameState.controllingPlayerIndex].chips;
}

function addMesssages(person, message) {
  var messages = document.getElementById("messages");
  var messageElement = document.createElement("li"); // Wrap person text in a b

  messageElement.innerHTML = "<b>" + person + "</b>" + message;
  messages.appendChild(messageElement);
  var game_messages = document.getElementsByClassName("chat");
  game_messages.scrollTop = game_messages.scrollHeight;
}

function sendChatMessage() {
  var message = messageInput.value;
  var messageAsBuffer = JSON.stringify({
    data: {
      message: message,
      eventType: "chatMessage"
    }
  });

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(messageAsBuffer);
  } else {
    console.warn("websocket is not connected");
  }

  messageInput.value = "";
}

var myInterval = setInterval(mainLoop, 1000);
var socket = new WebSocket('ws://localhost:3000');
socket.addEventListener('open', function () {
  console.log('Connected to WebSocket server');
});
socket.addEventListener('message', function (message) {
  var parsedData = JSON.parse(message.data);

  switch (parsedData.eventType) {
    case "updateGameState":
      if (parsedData) {
        gameState = parsedData.data;
      }

      var possibleActions = getPossibleActions();
      updateButtons(possibleActions);
      updateTable();

      if (parsedData.gameMessages.length > 0) {
        addMesssages("Dealer: ", parsedData.gameMessages[parsedData.gameMessages.length - 1]);
      }

      break;

    case "gameOver":
      // stopGame();
      break;

    case "chatMessage":
      addMesssages(parsedData.data.player + ": ", parsedData.data.message);
      break;

    default:
      console.error("unknown event ", parsedData);
  }

  console.log(parsedData);
});
socket.addEventListener('close', function () {
  console.log('Disconnected from WebSocket server');
});
socket.addEventListener('error', function (error) {
  console.error('WebSocket error:', error);
});