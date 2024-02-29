// config/index.js

require('dotenv').config(); // Load environment variables from a .env file

module.exports = {
  port: process.env.PORT,
  database: {
    url: process.env.DB_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Other database options
    },
  },
  jwtSecret: process.env.JWT_SECRET ,
};