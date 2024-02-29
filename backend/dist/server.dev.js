"use strict";

var app = require('./app');

var _require = require('./config'),
    port = _require.port,
    database = _require.database;

var mongoose = require('mongoose');

var initializeWebSocket = require('./websocketServer');

var _require2 = require('./services/gameService'),
    resetGames = _require2.resetGames; // Perform cleanup actions before exiting


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
}); // Connect to MongoDB

mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose.connect(database.url, database.options).then(function () {
  console.log('Connected to the database');
})["catch"](function (err) {
  console.error('Error connecting to the database:', err);
}); // Initialize WebSocket server

initializeWebSocket({
  port: 7071
}); // Start the server

app.listen(port, function () {
  console.log("Server running on port ".concat(port));
});