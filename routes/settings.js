const express = require("express");
const router = express.Router();
const path = require('path');

// handle the different routing depending on whether they are volunteer, guest, admin or organisation

router.get("/", (req, res, next) => {
    let sessionToken = req.session.userType;
    if (sessionToken == null || sessionToken === "admin") {
        res.sendFile(path.join(__dirname, '..', 'public', 'settingsAdmin.html'));
    } else if (sessionToken === "volunteer") {
        res.sendFile(path.join(__dirname, '..', 'public', 'settingsUser.html'));
    } else if (sessionToken === "organisation") {
        res.sendFile(path.join(__dirname, '..', 'public', 'settingsOrg.html'));
    }
});

module.exports = router;