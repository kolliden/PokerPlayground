const WebSocket = require('ws');
const { addPlayerToGame, removePlayerFromGame, applyGameRules, playerBet, playerFold } = require('./services/gameService');
const { formatDataForClient } = require('./utils/formating')

function initializeWebSocket(port = 7071) {
    // Initialize WebSocket server
    const wss = new WebSocket.Server({ port: 7071 });

    // Function to broadcast messages to all connected clients
    function broadcast(message) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
                // console.log("sent message to  via broadcast " + client, "message: " + message)
            }
        });
    }
    const broadcastFormattedData = (data, clients) => {
        for (var i = 0; i < data.players.length; i++) {
            clients.forEach(function (metadata, ws) {
                if (metadata.id === data.players[i]._id) { // TODO: this cant be efficient
                    formatted = formatDataForClient(data, data.players[i]._id);

                    formatted.controllingPlayerIndex = i;
                    sendMessage(ws, JSON.stringify({ eventType: "updateGameState", data: formatted }));
                }
            });
        }
    };

    function sendMessage(client, message) {
        //send messsage to one client
        if (client.readyState === WebSocket.OPEN) {
            // console.log("sent message to client " + client, "message: " + message);
            client.send(message);
        }
    }

    const clients = new Map();

    // WebSocket server logic
    wss.on('connection', async (ws) => {
        console.log('A new WebSocket client connected');
        const id = uuidv4();
        const color = Math.floor(Math.random() * 360);

        let data = await addPlayerToGame(id);
        const gameID = data._id;

        const metadata = { id, color, gameID };
        clients.set(ws, metadata);

        console.log('Connecting to server ' + id + ' with metadata ' + metadata + " to game: " + gameID);

        data = await applyGameRules(metadata.gameID);
        if (data) {
            broadcastFormattedData(data, clients);
        }


        ws.on('message', async (messageAsBuffer) => {
            let message = JSON.parse(messageAsBuffer);
            const metadata = clients.get(ws);

            message.sender = metadata.id;
            message.color = metadata.color;
            message.gameID = metadata.gameID;

            console.log('Received message from client ' + metadata.id + ':', message);

            try {
                switch (message.data.eventType) {
                    case "playerAction":
                        if (message.data.action === "bet") {
                            if (data) {
                                let data = await playerBet(message.gameID, message.sender, message.data.amount);
                                data = await applyGameRules(metadata.gameID);

                                broadcastFormattedData(data, clients);
                            }
                        } else if (message.data.action === "fold") {
                            if (data) {
                                console.log("player " + message.sender + " folded");
                                await playerFold(message.gameID, message.sender);
                                data = await applyGameRules(metadata.gameID);

                                broadcastFormattedData(data, clients);
                            }
                        }
                        break;
                    case "chatMessage":
                        console.error("Chat message not implemented");
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
            removePlayerFromGame(clients.get(ws).gameID, clients.get(ws).id);
            clients.delete(ws);
        });
    });
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

module.exports = initializeWebSocket;