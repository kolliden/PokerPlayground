const { port, database, jwtSecret } = require('./config');
const mongoose = require('mongoose');
const initializeGameServer = require('./websocketServer');
const WebSocket = require('ws');
const { resetGames } = require('./services/gameService');

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');

const app = express();

const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const authRoutes = require('./routes/authRoutes');
const webRoutes = require('./routes/webRoutes');


function onSocketError(err) {
    console.error(err);
}

// Perform cleanup actions before exiting
async function cleanup() {
    await resetGames();
}

// Event listener for process exit
process.on('exit', async () => {
    await cleanup();
    console.log('Process is exiting...');
});

// Event listener for Ctrl+C signal (SIGINT)
process.on('SIGINT', async () => {
    await cleanup();
    console.log('\nCtrl+C pressed. Exiting...');
    process.exit(0); // Manually exit the process after cleanup
});

//Setup defaut store
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/pokerDB',
    collection: 'sessions'
});

store.on('error', function(error) {
    console.log(error);
});

const sessionParser = require('express-session')({
    saveUninitialized: false,
    secret: jwtSecret,
    resave: false,
    store: store,
});


const map = new Map();

// CONFIGURE HEADER INFORMATION
// Allow request from any source. In real production, this should be limited to allowed origins only
app.use(cors());
app.disable("x-powered-by"); //Reduce fingerprinting
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve all static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessionParser);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/auth', authRoutes);
app.use('', webRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Connect to MongoDB
mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose.connect(database.url, database.options)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });

const server = require('http').createServer(app);


// Initialize WebSocket server
const wss = new WebSocket.Server({
    clientTracking: false, noServer: true
});
console.log("WebSocket server listening on port " + port);

server.on('upgrade', function (request, socket, head) {
    socket.on('error', onSocketError);

    console.log('Parsing session from request...');

    sessionParser(request, {}, () => {
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