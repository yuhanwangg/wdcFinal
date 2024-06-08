const express = require("express");
const router = express.Router();
var path = require('path');
const mysql = require('mysql');

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    database: 'WDCProject'
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('yippee connected');
});


router.get("/", (req, res, next) => {
    let sessionToken = req.session.userType;
    if (sessionToken == null) {
        res.sendFile(path.join(__dirname, '..', 'public', 'homeGuest.html'));
    } else if (sessionToken === "volunteer") {
        res.sendFile(path.join(__dirname, '..', 'public', 'homeVolunteer.html'));
    } else if (sessionToken === "organisation") {
        // check if they are verified
        const query = "SELECT * FROM Organisations WHERE description IS NULL OR description = '' OR imgPath IS NULL OR imgPath = '' OR orgSite IS NULL OR orgSite = '';";
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            if (results.length > 0) {
                // field empty? send to no verified
                console.log("sent to non verified!")
                res.sendFile(path.join(__dirname, '..', 'public', 'homeOrgNoVerify.html'));
            } else {
                // if redirect to verified page
                console.log("send to verified!");
                res.sendFile(path.join(__dirname, '..', 'public', 'homeOrgVerified.html'));
            }
        });
    } else if (sessionToken === "admin") {
        res.sendFile(path.join(__dirname, '..', 'public', 'AdminCreateAdmin.html'));
    }
});

module.exports = router;
