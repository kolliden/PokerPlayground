const express = require('express');
const router = express.Router();
const path = require('path');
const verify = require("../middleware/verify.js");

router.get('/', verify, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.htm'));
});

module.exports = router;