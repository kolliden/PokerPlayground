// config/index.js

require('dotenv').config(); // Load environment variables from a .env file

module.exports = {
  port: process.env.PORT || 3000, // Default port or use from environment variable
  database: {
    url: process.env.DB_URL || 'mongodb://localhost:27017/pokerDB', // Database connection URL
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Other database options
    },
  },
  jwtSecret: process.env.JWT_SECRET || 'yourSecretKeyForJWT', // Secret key for JWT token
};