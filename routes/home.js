const express = require("express");
const router = express.Router();
var path = require('path');
var mysql = require('mysql');

router.get("/", (req, res, next) => {
    let sessionToken = req.session.userType;
    if (sessionToken == null) {
        res.sendFile(path.join(__dirname, '..', 'public', 'homeGuest.html'));
    } else if (sessionToken === "volunteer") {
        res.sendFile(path.join(__dirname, '..', 'public', 'homeVolunteer.html'));
    } else if (sessionToken === "organisation") {
        res.sendFile(path.join(__dirname, '..', 'public', 'homeOrgNoVerify.html'));
    } else if (sessionToken === "admin") {
        res.sendFile(path.join(__dirname, '..', 'public', 'AdminCreateAdmin.html'));
    }
});

module.exports = router;
