const app = require('./app');
const { port, database } = require('./config');
const mongoose = require('mongoose');
const initializeWebSocket = require('./websocketServer');
const { resetGames } = require('./services/gameService');

// Perform cleanup actions before exiting
async function cleanup() {
    await resetGames();
}

// Event listener for process exit
process.on('exit', async() => {
    await cleanup();
    console.log('Process is exiting...');
});

// Event listener for Ctrl+C signal (SIGINT)
process.on('SIGINT', async() => {
    await cleanup();
    console.log('\nCtrl+C pressed. Exiting...');
    process.exit(0); // Manually exit the process after cleanup
});

// Connect to MongoDB
mongoose.connect(database.url, database.options)
    .then(() => {
        console.log('Connected to the database');
        // Start the server
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });

// Initialize WebSocket server
initializeWebSocket({ port });