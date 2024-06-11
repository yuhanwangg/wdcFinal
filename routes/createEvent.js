const express = require("express");
const router = express.Router();
const path = require('path');

// handle the different routing depending on whether they are volunteer, guest, admin or organisation

router.get("/", (req, res, next) => {
    // res.sendFile(path.join(__dirname, '..', 'public', 'VolunteerOpportunitiesGuest.html'));
    let sessionToken = req.session.userType;
    if (sessionToken === "organisation") {
        res.sendFile(path.join(__dirname, '..', 'public', 'CreateVolunteerOpportunity.html'));
    }
});

module.exports = router;