const express = require("express");
const router = express.Router();
var path = require('path');
var mysql = require('mysql');

router.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'homeGuest.html'));
});

module.exports = router;
