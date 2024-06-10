const express = require("express");
const router = express.Router();
const path = require('path');

// handle the different routing depending on whether they are volunteer, guest, admin or organisation

// if admin, send to edit organisation

// if anything else, send to find organisations
router.get("/", (req, res, next) => {

    let sessionToken = req.session.userType;
    if (sessionToken === 'admin') {
        res.sendFile(path.join(__dirname, '..', 'public', 'AdminOrganisation.html'));
    } else {
        res.sendFile(path.join(__dirname, '..', 'public', 'findOrganisations.html'));
    }
});

module.exports = router;