const express = require("express");
const router = express.Router();
const path = require('path');

// handle the different routing depending on whether they are volunteer, guest, admin or organisation

router.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'UpdatesOrganisations.html'));
});

module.exports = router;