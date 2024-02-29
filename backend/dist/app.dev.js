"use strict";

var _require = require('./config'),
    port = _require.port,
    database = _require.database,
    jwtSecret = _require.jwtSecret;

var mongoose = require('mongoose');

var initializeGameServer = require('./websocketServer');

var WebSocket = require('ws');

var _require2 = require('./services/gameService'),
    resetGames = _require2.resetGames;

var express = require("express");

var cors = require("cors");

var cookieParser = require("cookie-parser");

var path = require('path');

var app = express();

var userRoutes = require('./routes/userRoutes');

var gameRoutes = require('./routes/gameRoutes');

var authRoutes = require('./routes/authRoutes');

var webRoutes = require('./routes/webRoutes');

function onSocketError(err) {
  console.error(err);
} // Perform cleanup actions before exiting


function cleanup() {
  return regeneratorRuntime.async(function cleanup$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(resetGames());

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
} // Event listener for process exit


process.on('exit', function _callee() {
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(cleanup());

        case 2:
          console.log('Process is exiting...');

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // Event listener for Ctrl+C signal (SIGINT)

process.on('SIGINT', function _callee2() {
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(cleanup());

        case 2:
          console.log('\nCtrl+C pressed. Exiting...');
          process.exit(0); // Manually exit the process after cleanup

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}); //Setup defaut store

var session = require('express-session');

var MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore({
  uri: 'mongodb://127.0.0.1:27017/pokerDB',
  collection: 'sessions'
});
store.on('error', function (error) {
  console.log(error);
});

var sessionParser = require('express-session')({
  saveUninitialized: false,
  secret: jwtSecret,
  resave: false,
  store: store
});

var map = new Map(); // CONFIGURE HEADER INFORMATION
// Allow request from any source. In real production, this should be limited to allowed origins only

app.use(cors());
app.disable("x-powered-by"); //Reduce fingerprinting

app.use(cookieParser());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json()); // Serve all static files from the public directory

app.use(express["static"](path.join(__dirname, 'public')));
app.use(sessionParser); // Routes

app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/auth', authRoutes);
app.use('', webRoutes); // Error handling middleware

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
}); // Connect to MongoDB

mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose.connect(database.url, database.options).then(function () {
  console.log('Connected to the database');
})["catch"](function (err) {
  console.error('Error connecting to the database:', err);
});

var server = require('http').createServer(app); // Initialize WebSocket server


var wss = new WebSocket.Server({
  clientTracking: false,
  noServer: true
});
console.log("WebSocket server listening on port " + port);
server.on('upgrade', function (request, socket, head) {
  socket.on('error', onSocketError);
  console.log('Parsing session from request...');
  sessionParser(request, {}, function () {
    if (!request.session.user) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    console.log('Session is parsed!');
    socket.removeListener('error', onSocketError);
    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request);
    });
  });
});
initializeGameServer(wss);
server.listen(3000);