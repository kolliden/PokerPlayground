"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('./services/gameService'),
    addPlayerToGame = _require.addPlayerToGame,
    removePlayerFromGame = _require.removePlayerFromGame,
    applyGameRules = _require.applyGameRules,
    playerBet = _require.playerBet,
    playerFold = _require.playerFold,
    getGameData = _require.getGameData;

var _require2 = require('./utils/formating'),
    formatDataForClient = _require2.formatDataForClient;

var WebSocket = require('ws');

function initializeGameServer(wss) {
  // Function to broadcast messages to all connected clients
  function broadcast(message) {
    wss.clients.forEach(function (client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message)); // console.log("sent message to  via broadcast " + client, "message: " + message)
      }
    });
  }

  var broadcastFormattedData = function broadcastFormattedData(data, gameMessage, clients) {
    clients.forEach(function (ws, userId) {
      formatted = formatDataForClient(data, userId);
      formatted.controllingPlayerIndex = data.players.findIndex(function (player) {
        return player._id === userId;
      }) + 1;
      sendMessage(ws, JSON.stringify({
        eventType: "updateGameState",
        data: formatted,
        gameMessages: [gameMessage]
      }));
    });
  };

  function sendMessage(client, message) {
    //send messsage to one client
    if (client.readyState === WebSocket.OPEN) {
      console.log("sent message to client " + userId, "message: " + message);
      client.send(message);
    }
  }

  var clients = new Map(); // WebSocket server logic

  wss.on('connection', function _callee2(ws, req) {
    var data, gameId, _ref, _ref2;

    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('WebSocket client connected...');
            userId = req.session.user._id;
            _context2.next = 4;
            return regeneratorRuntime.awrap(addPlayerToGame(req.session.user._id));

          case 4:
            data = _context2.sent;
            gameId = data._id;
            clients.set(userId, ws);
            req.session.user.gameId = gameId;
            req.session.save();
            console.log(req.session.user.username + ' is connecting to the server. ' + " To game: " + gameId);
            _context2.next = 12;
            return regeneratorRuntime.awrap(applyGameRules(req.session.user.gameId));

          case 12:
            _ref = _context2.sent;
            _ref2 = _slicedToArray(_ref, 2);
            data = _ref2[0];
            gameMessage = _ref2[1];

            if (data) {
              broadcastFormattedData(data, gameMessage, clients);
            }

            ws.on('error', function (err) {
              console.dir(err);
            });
            ws.on('message', function _callee(messageAsBuffer) {
              var message, gameMessage, _data, _ref3, _ref4, _ref5, _ref6, playerName, temp;

              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      message = JSON.parse(messageAsBuffer);
                      gameMessage = null;
                      _context.prev = 2;
                      _context.t0 = message.data.eventType;
                      _context.next = _context.t0 === "playerAction" ? 6 : _context.t0 === "chatMessage" ? 32 : 42;
                      break;

                    case 6:
                      if (!(message.data.action === "bet")) {
                        _context.next = 20;
                        break;
                      }

                      if (!data) {
                        _context.next = 18;
                        break;
                      }

                      _context.next = 10;
                      return regeneratorRuntime.awrap(playerBet(req.session.user.gameId, userId, message.data.amount));

                    case 10:
                      _data = _context.sent;
                      _context.next = 13;
                      return regeneratorRuntime.awrap(applyGameRules(req.session.user.gameId));

                    case 13:
                      _ref3 = _context.sent;
                      _ref4 = _slicedToArray(_ref3, 2);
                      _data = _ref4[0];
                      gameMessage = _ref4[1];
                      broadcastFormattedData(_data, gameMessage, clients);

                    case 18:
                      _context.next = 31;
                      break;

                    case 20:
                      if (!(message.data.action === "fold")) {
                        _context.next = 31;
                        break;
                      }

                      if (!data) {
                        _context.next = 31;
                        break;
                      }

                      _context.next = 24;
                      return regeneratorRuntime.awrap(playerFold(message.gameID, message.sender));

                    case 24:
                      _context.next = 26;
                      return regeneratorRuntime.awrap(applyGameRules(metadata.gameID));

                    case 26:
                      _ref5 = _context.sent;
                      _ref6 = _slicedToArray(_ref5, 2);
                      data = _ref6[0];
                      gameMessage = _ref6[1];
                      broadcastFormattedData(data, gameMessage, clients);

                    case 31:
                      return _context.abrupt("break", 43);

                    case 32:
                      console.log("chatMessage: " + JSON.stringify(message));

                      if (!message.data.message) {
                        _context.next = 41;
                        break;
                      }

                      _context.next = 36;
                      return regeneratorRuntime.awrap(getGameData(message.gameID));

                    case 36:
                      data = _context.sent;
                      playerName = data.players.find(function (player) {
                        return player._id === message.sender;
                      }).name;
                      temp = {
                        data: {
                          message: message.data.message,
                          player: playerName
                        },
                        eventType: "chatMessage"
                      };
                      console.log(temp);
                      broadcast(temp, clients);

                    case 41:
                      return _context.abrupt("break", 43);

                    case 42:
                      console.error("Unknown message type");

                    case 43:
                      _context.next = 48;
                      break;

                    case 45:
                      _context.prev = 45;
                      _context.t1 = _context["catch"](2);
                      console.error('Error handling message:', _context.t1);

                    case 48:
                    case "end":
                      return _context.stop();
                  }
                }
              }, null, null, [[2, 45]]);
            }); // WebSocket close handling

            ws.on("close", function () {
              console.log("WebSocket close ");
              removePlayerFromGame(gameId, userId);
              clients["delete"](userId);
            });

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
  wss.on('error', function (err) {
    console.dir(err);
  });

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }

  return wss;
}

module.exports = initializeGameServer;