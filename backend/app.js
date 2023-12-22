const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const authRoutes = require('./routes/authRoutes');

// Middlewares
app.use(express.json()); // Body parsing middleware
// Add other middlewares as needed (logging, authentication, etc.)

// Routes
app.use('/api/users', () => userRoutes);
app.use('/api/games', () => gameRoutes);
app.use('/api/auth',  () => authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = app;
