const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/updateInfo', authController.logout);//temporary

module.exports = router;