const { addPlayerToGame, removePlayerFromGame, applyGameRules, playerBet, playerFold, getGameData } = require('./services/gameService');
const { formatDataForClient } = require('./utils/formating');
const WebSocket = require('ws');

function initializeGameServer(wss) {
    // Function to broadcast messages to all connected clients
    function broadcast(message) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
                // console.log("sent message to  via broadcast " + client, "message: " + message)
            }
        });
    }
    const broadcastFormattedData = (data, gameMessage, clients) => {
        clients.forEach(function (ws , userId) {
            formatted = formatDataForClient(data, userId);
            formatted.controllingPlayerIndex = data.players.findIndex((player) => player._id === userId)+1;
            sendMessage(ws, JSON.stringify({ eventType: "updateGameState", data: formatted, gameMessages: [gameMessage] }));
        });
    };

    function sendMessage(client, message) {
        //send messsage to one client
        if (client.readyState === WebSocket.OPEN) {
            console.log("sent message to client " + userId, "message: " + message);
            client.send(message);
        }
    }

    const clients = new Map();

    // WebSocket server logic
    wss.on('connection', async (ws, req) => {
        console.log('WebSocket client connected...');
        userId = req.session.user._id;

        let data = await addPlayerToGame(req.session.user._id);
        const gameId = data._id;

        clients.set(userId, ws);

        req.session.user.gameId = gameId;
        req.session.save();

        console.log(req.session.user.username + ' is connecting to the server. ' + " To game: " + gameId);

        [data, gameMessage] = await applyGameRules(req.session.user.gameId);
        if (data) {
            broadcastFormattedData(data, gameMessage, clients);
        }

        ws.on('error', err => {
            console.dir(err);
        });

        ws.on('message', async (messageAsBuffer) => {
            let message = JSON.parse(messageAsBuffer);
            let gameMessage = null;
            try {
                switch (message.data.eventType) {
                    case "playerAction":
                        if (message.data.action === "bet") {
                            if (data) {
                                let data = await playerBet(req.session.user.gameId, userId, message.data.amount);
                                [data, gameMessage] = await applyGameRules(req.session.user.gameId);

                                broadcastFormattedData(data, gameMessage, clients);
                            }
                        } else if (message.data.action === "fold") {
                            if (data) {
                                await playerFold(message.gameID, message.sender);
                                [data, gameMessage] = await applyGameRules(metadata.gameID);

                                broadcastFormattedData(data, gameMessage, clients);
                            }
                        }
                        break;
                    case "chatMessage":
                        console.log("chatMessage: " + JSON.stringify(message));
                        if (message.data.message) {
                            data = await getGameData(message.gameID);
                            let playerName = data.players.find((player) => player._id === message.sender).name;
                            let temp = { data: { message: message.data.message, player: playerName }, eventType: "chatMessage" }
                            console.log(temp);
                            broadcast(temp, clients);
                        }
                        break;
                    default:
                        console.error("Unknown message type");
                }
            } catch (err) {
                console.error('Error handling message:', err);
            }
        });

        // WebSocket close handling
        ws.on("close", () => {
            console.log("WebSocket close ")
            removePlayerFromGame(gameId, userId);
            clients.delete(userId);
        });
    });
    wss.on('error', err => {
        console.dir(err);
    });

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    return wss;
}

module.exports = initializeGameServer;