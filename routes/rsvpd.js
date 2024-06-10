const express = require("express");
const router = express.Router();
const path = require('path');

// handle the different routing depending on whether they are volunteer, guest, admin or organisation

router.get("/", (req, res, next) => {
    if (req.session.userType === "volunteer") {
        res.sendFile(path.join(__dirname, '..', 'public', 'rsvp.html'));
    } else {
        window.location.href = "/home";
    }
});

module.exports = router;