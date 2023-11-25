// const actions = ["fold", "check", "call", "raise"]

const callBtn = document.getElementById("callBtn");
const raiseBtn = document.getElementById("raiseBtn");
const raiseInput = document.getElementById("raiseInput");
const foldBtn = document.getElementById("foldBtn");
const checkBtn = document.getElementById("checkBtn");
const betBtn = document.getElementById("betBtn");

let lastBet = 30;
let playerTurn = true;

function stopGame() {
    clearInterval(myInterval);
}
// check what actions are possible
function getPossibleActions() {
    let possibeActions = [];
    if (lastBet == 0) {
        possibeActions.push("check");
        possibeActions.push("bet");
    } else {
        possibeActions.push("fold");
        possibeActions.push("call");
        possibeActions.push("raise");
    }
    return possibeActions;
}

function updateButtons(possibeActions) {
    if (!playerTurn) {
        callBtn.classList.add("hidden");
        raiseBtn.classList.add("hidden");
        checkBtn.classList.add("hidden");
        betBtn.classList.add("hidden");
        foldBtn.classList.add("hidden");
        raiseInput.classList.add("hidden");
        return;
    }

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
        raiseBtn.classList.add("hidden");
    }
    if (possibeActions.includes("bet")) {
        betBtn.classList.remove("hidden");
    } else {
        betBtn.classList.add("hidden");
    }

}

function mainLoop() {
    // check what actions are possible
    let possibleActions = getPossibleActions();
    updateButtons(possibleActions);
}


var myInterval = setInterval(mainLoop, 1000);