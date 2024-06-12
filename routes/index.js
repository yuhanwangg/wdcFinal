var express = require('express');
var bodyParser = require('body-parser');
var bodyParser = require('body-parser');
var router = express.Router();
router.use(bodyParser.json());
var adminIdCounter = 1;
const path = require("path");

var mysql = require('mysql');

const multer = require('multer');

var nodemailer = require('nodemailer')

var session = require('express-session');
const { hashPass, deHashPass } = require('/workspaces/24S1_WDC_UG_Group_42/authHash.js');

var connection = mysql.createConnection({
  host: 'localhost',
  database: 'WDCProject'
});

connection.connect(function (err) {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  //console.log('Connected to database');
});
router.use(bodyParser.json());


let transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  auth: {
    user: 'HeartFeltHelpersVolunteering@outlook.com',
    pass: 'WDCProject'
  }
});

// creating destination for storage

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "organisation_logos");
  },
  filename: (req, file, cb) => {
    //console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Invalid file type');
      error.code = 'INVALID_FILE_TYPE';
      return cb(error, false);
    }

    cb(null, true);
  }
});

var adminIdCounter = 1;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/home'); // Redirect to /home
});

/* GET user count from database */
router.get('/userCount', function (req, res, next) {
  connection.query('SELECT COUNT(*) AS count FROM User', function (error, results, fields) {
    if (error) {
      console.error('Error querying database: ' + error.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Return user count as JSON response
    res.json({ count: results[0].count });
  });
});

// GET most recent posts
router.get('/recentPostsVolun', function (req, res, next) {
  const query = `
    SELECT
      o.oppID,
      o.oppName,
      o.tags,
      o.dates,
      o.address,
      o.commitment,
      o.suitability,
      o.training,
      o.requirements,
      o.thumbnail,
      o.description,
      o.dates,
      b.branchID,
      b.branchName,
      org.orgName as organisationName
    FROM Opportunities o
    JOIN Branch b ON o.branchID = b.branchID
    JOIN Organisations org ON b.orgID = org.orgID
    WHERE EXISTS (
      SELECT 1 FROM FollowedBranches fb
      WHERE fb.userID = ?
      AND fb.branchID = o.branchID
    )
    ORDER BY o.dates DESC
    LIMIT 3`;

  connection.query(query, [req.session.accountID], function (error, results, fields) {
    if (error) {
      console.error('Error querying database: ' + error.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

router.get('/recentUpdatesVolun', (req, res) => {
  const query = `SELECT Updates.updateID,
                   Updates.updateName,
                   Updates.updateMsg,
                   Updates.dateCreated,
                   Organisations.orgName,
                   Organisations.imgPath,
                   Branch.branchID,
                   Branch.branchName
                   FROM Updates
                   JOIN Branch ON Updates.branchID = Branch.branchID
                   JOIN Organisations ON Branch.orgID = Organisations.orgID
                   WHERE EXISTS (
                     SELECT 1 FROM FollowedBranches fb
                     WHERE fb.userID = ?
                     AND fb.branchID = Updates.branchID
                   )
                   ORDER BY Updates.dateCreated DESC
                   LIMIT 3;`;

  connection.query(query, [req.session.accountID], (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

router.post('/addAdmin', function (req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { first_name, last_name, email, password } = req.body;
  //console.log("values in /addAdmin are" + first_name, last_name, email, password);


  //get the last created and used AdminId
  var currAdminIdQuery = "SELECT adminId FROM Admin ORDER BY adminId DESC LIMIT 1;";
  connection.query(currAdminIdQuery, async function (err1, result) {
    //release the query, don't need access to the database anymore

    //error handling
    if (err1) {
      //console.log("Got error while fetching AdminID: ", err1);
      res.sendStatus(500);
      return;
    }

    let currAdminId = 1;
    if (result.length > 0) {
      currAdminId = result[0].adminId + 1
    }
    //console.log("the new admin id is " + currAdminId);

    //hash password
    var hash;

    try {
      hash = await hashPass(password);
    } catch (err) {
      //console.log("error in hash");
      res.sendStatus(500);
      return;
    }

    var query = "INSERT INTO Admin (adminId, firstname, lastName, email, password) VALUES (?, ?, ?, ?, ?);";

    //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
    //err1 is the error, returnVal is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
    connection.query(query, [currAdminId, first_name, last_name, email, hash], function (err2, returnVal) {
      //release the query, don't need access to the database anymore
      //error handling
      if (err2) {
        //console.log("Got error while inserting new admin: ", err2);
        res.sendStatus(500);
        return;
      }
      //send an empty response, not needing to return anything, or can send a message for clarity
      res.send("successfully added");
      return;
    });
  });
});

router.get('/orgDetails', function (req, res, next) {
  //console.log("i am here now!!!");

  const orgName = req.query.orgName;
  const email = req.query.email;
  //console.log("the org name and email in /orgDetails is " + orgName + " " + email);
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  //console.log("connected to pool");
  //this is the query which i can change
  var query = "SELECT orgName, email, description, orgID FROM Organisations WHERE orgName = ? AND email = ?;";
  //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
  connection.query(query, [orgName, email], function (err1, rows, fields) {

    //close the door of the database, its like a bank vault, once we have opened it and got out the money (using the query) we close it
    if (err1) {
      //console.log("Error executing query:", err1);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (rows.length === 0) {
      // Organization not found
      res.status(404).json({ error: "Organization not found" });
      return;
    }

    // Organization found, send back the details
    res.json(rows[0]);
    return;
  });
});

router.get('/orgBranchRequests', function (req, res, next) {
  //console.log("i am in the branch requests index.js!!!");
  const orgName = req.query.orgName;
  const email = req.query.email;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  //console.log("connected to pool in org branch requests");
  // First query to get the orgID
  var IDquery = "SELECT orgID FROM Organisations WHERE orgName = ? AND email = ?;";
  connection.query(IDquery, [orgName, email], function (err1, rows1) {

    if (err1) {
      //console.log("Error executing ID query:", err1);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (rows1.length === 0) {
      // Organization not found
      res.status(404).json({ error: "Organization not found" });
      return;
    }

    const orgID = rows1[0].orgID;

    // Second query to get the branch requests using the orgID
    var branchRequestQuery = "SELECT branchName FROM Branch WHERE orgID = ? AND instated = 0";
    connection.query(branchRequestQuery, [orgID], function (err2, rows2) {
      if (err2) {
        //console.log("Error executing branch request query:", err2);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Branch requests found, send back the details
      res.json(rows2);
      return;
    });
  });
});

router.get('/orgCurrentBranches', function (req, res, next) {
  //console.log("i am in  current branch function now!!!");
  const orgName = req.query.orgName;
  const email = req.query.email;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  //console.log("connected to pool for current branch");
  // First query to get the orgID
  var IDquery = "SELECT orgID FROM Organisations WHERE orgName = ? AND email = ?;";
  connection.query(IDquery, [orgName, email], function (err1, rows1) {

    if (err1) {

      //console.log("Error executing ID query:", err1);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (rows1.length === 0) {

      // Organization not found
      res.status(404).json({ error: "Organization not found" });
      return;
    }

    const orgID = rows1[0].orgID;

    // Second query to get the branch requests using the orgID
    var branchRequestQuery = "SELECT branchName FROM Branch WHERE orgID = ? AND instated = 1";
    connection.query(branchRequestQuery, [orgID], function (err2, rows2) {
      if (err2) {
        //console.log("Error executing branch current query:", err2);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Branch requests found, send back the details
      res.json(rows2);
      return;
    });
  });
});

router.post('/instantiateBranch', function (req, res, next) {
  //console.log("went into instantiateBranch");
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { branchName, orgName, orgEmail } = req.body;
  //console.log(branchName, orgName, orgEmail);

  //get the connection again
  // First query to get the orgID
  var IDquery = "SELECT orgID FROM Organisations WHERE orgName = ? AND email = ?;";
  connection.query(IDquery, [orgName, orgEmail], function (err1, rows1) {

    if (err1) {
      //console.log("Error executing ID query:", err1);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (rows1.length === 0) {
      // Organization not found
      res.status(404).json({ error: "Organization not found" });
      return;
    }

    var orgID = rows1[0].orgID;

    // Second query to alter the branch instanitated value
    var updateInstanitatedQuery = "UPDATE Branch SET instated = 1 WHERE orgID = ? AND branchName = ?;";
    connection.query(updateInstanitatedQuery, [orgID, branchName], function (err2, rows2) {
      if (err2) {
        //console.log("Error executing branch current query:", err2);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Branch requests found, send back the details
      res.json(rows2);
      return;
    });
  });
});


router.post('/removeBranch', function (req, res, next) {
  //console.log("went into removeBranch");
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { branchName, orgName, orgEmail } = req.body;
  //console.log(branchName, orgName, orgEmail);

  //get the connection again
  // First query to get the orgID
  var IDquery = "SELECT orgID FROM Organisations WHERE orgName = ? AND email = ?;";
  connection.query(IDquery, [orgName, orgEmail], function (err1, rows1) {

    if (err1) {
      //console.log("Error executing ID query:", err1);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (rows1.length === 0) {
      // Organization not found
      res.status(404).json({ error: "Organization not found" });
      return;
    }

    const orgID = rows1[0].orgID;

    // Second query to remove the branch and everything associated with it (ON DELETE CASCADE)
    var updateInstanitatedQuery = "DELETE FROM Branch WHERE orgID = ? AND branchName = ?;";
    connection.query(updateInstanitatedQuery, [orgID, branchName], function (err2, rows2) {
      if (err2) {
        //console.log("Error executing branch current query:", err2);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Branch requests found, send back the details
      res.json(rows2);
      return;
    });
  });
});

router.post('/orgInfo', function (req, res, next) {
  // const orgId = req.query.param;

  // const {orgId} = req.body;
  const { orgName, orgEmail } = req.body;
  //console.log("i am here now in orgInfo!!!");
  //console.log("i am here now in orgInfo!!! and the orgId is " + orgId);
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  //console.log("connected to pool");
  //this is the query which i can change
  // var query = "SELECT orgName, email, description FROM Organisations WHERE orgID = ?;";

  var query = "SELECT orgName, email, description FROM Organisations WHERE orgName = ? AND email = ? ;";
  //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
  // connection.query(query, [orgId], function(err1, rows, fields) {
  connection.query(query, [orgName, orgEmail], function (err1, rows, fields) {
    //close the door of the database, its like a bank vault, once we have opened it and got out the money (using the query) we close it
    //error handling
    if (err1) {
      res.sendStatus(500);
      return;
    }
    //in this case we are recieving information from our query which we want to send back, so we send back a json version of the rows
    res.json(rows);
  });
});

router.post('/orgId', function (req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name

  const { orgName, orgEmail } = req.body;
  //console.log("the orgName and email in the index.js /orgId is " + orgName + " " + orgEmail);

  // First query to get the orgID

  var query = "SELECT orgID FROM Organisations WHERE orgName = ? AND email = ? ;";

  connection.query(query, [orgName, orgEmail], function (err1, rows, fields) {
    //console.log("the built query is: " + query);
    //console.log("orgName value is: " + orgName);
    //console.log("orgEmail value is: " + orgEmail);

    if (err1) {
      //console.log("Error executing ID query:", err1);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (rows.length === 0) {
      // Organization not found
      //console.log("I AM HERE!!");
      res.status(404).json({ error: "Organization not found" });
      return;
    }

    //console.log("the found orgId in index.js is " + rows[0].orgID);
    res.json(rows);
  });
});

router.post('/saveOrgInfoNewName', function (req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { orgId, newOrgName, newOrgEmail, newOrgDescription } = req.body;
  //console.log("in saveOrgInfo index.js the values parsed are" + orgId + " " + newOrgName + " " + newOrgEmail + " " + newOrgDescription);

  if (orgId > 0) {
    //get the connection again
    //changed query
    var query = "UPDATE Organisations SET orgName = ?, email = ?, description = ? WHERE orgID = ?;";

    //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
    //err1 is the error, rows is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
    connection.query(query, [newOrgName, newOrgEmail, newOrgDescription, orgId], function (err1, rows, fields) {
      //release the query, don't need access to the database anymore
      //error handling
      if (err1) {
        res.sendStatus(500);
        return;
      }
      //send an empty response, not needing to return anything, or can send a message for clarity
      res.send("successfully updated");
    });
  }
  else {
    res.status(404).json({ error: "Organization not found" });
    return
  }
});


router.post('/saveOrgInfoOldName', function (req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { orgId, newOrgName, newOrgEmail, newOrgDescription } = req.body;
  //console.log("in saveOrgInfoOldName index.js the values parsed are" + orgId + " " + newOrgName + " " + newOrgEmail + " " + newOrgDescription);

  if (orgId > 0) {
    //get the connection again
    //changed query
    var query = "UPDATE Organisations SET email = ?, description = ? WHERE orgID = ?;";

    //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
    //err1 is the error, rows is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
    connection.query(query, [newOrgEmail, newOrgDescription, orgId], function (err1, rows, fields) {
      //release the query, don't need access to the database anymore
      //error handling
      if (err1) {
        res.sendStatus(500);
        return;
      }
      //send an empty response, not needing to return anything, or can send a message for clarity
      res.send("successfully updated");
    });
  }
  else {
    res.status(404).json({ error: "Organization not found" });
    return
  }
});

router.post('/deleteOrg', function (req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { orgId } = req.body;

  //console.log("went into /deleteOrg and orgId = " + orgId);

  if (orgId > 0) {
    //get the connection again

    //changed query
    var query = "DELETE FROM Organisations WHERE orgID = ?;";

    //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
    //err1 is the error, rows is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
    connection.query(query, [orgId], function (err1, rows, fields) {
      //release the query, don't need access to the database anymore
      //error handling
      if (err1) {
        res.sendStatus(500);
        return;
      }
      //send an empty response, not needing to return anything, or can send a message for clarity
      res.send("successfully deleted");
    });
  }
  else {
    res.status(404).json({ error: "Organization not found" });
    return
  }
});

router.get('/userDetails', function (req, res, next) {
  //console.log("i am here now!!!");

  const firstName = req.query.userFirstName;
  const lastName = req.query.userLastName;
  const email = req.query.email;
  //console.log("the first name, last name, and email in /userDetails is " + firstName + " " + lastName + " " + email);
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database

  //console.log("connected to pool");
  //this is the query which i can change
  var query = "SELECT userID, firstName, lastName, email FROM User WHERE firstName = ? AND lastName = ? AND email = ?;";
  //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
  connection.query(query, [firstName, lastName, email], function (err1, rows, fields) {

    //close the door of the database, its like a bank vault, once we have opened it and got out the money (using the query) we close it
    if (err1) {
      console.log("Error executing query:", err1);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (rows.length === 0) {
      // Organization not found
      res.status(404).json({ error: "Users not found" });
      return;
    }

    // Users found, send back the details
    res.json(rows);
    return;
  });
});

router.post('/userInfo', function (req, res, next) {

  const { userID } = req.body;
  //console.log("i am here now in userInfo!!!");

  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  //console.log("connected to pool");
  //this is the query which i can change

  var query = "SELECT firstName, lastName, email FROM User WHERE userID = ? ;";
  //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields

  connection.query(query, [userID], function (err1, rows, fields) {
    //close the door of the database, its like a bank vault, once we have opened it and got out the money (using the query) we close it
    //error handling
    if (err1) {
      res.sendStatus(500);
      return;
    }
    //in this case we are recieving information from our query which we want to send back, so we send back a json version of the rows
    res.json(rows);
  });

});


router.post('/saveUserInfo', function (req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { userID, newFirstName, newLastName, newEmail } = req.body;

  if (userID > 0) {
    //changed query
    var query = "UPDATE User SET firstName = ?, lastName = ?, email = ? WHERE userID = ?;";

    //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
    //err1 is the error, rows is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
    connection.query(query, [newFirstName, newLastName, newEmail, userID], function (err1, rows, fields) {
      //release the query, don't need access to the database anymore
      //error handling
      if (err1) {
        res.sendStatus(500);
        return;
      }
      //send an empty response, not needing to return anything, or can send a message for clarity
      res.send("successfully updated");
    });
  }
  else {
    res.status(404).json({ error: "User not found" });
    return
  }
});



router.post('/deleteUser', function (req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { userID } = req.body;

  //console.log("went into /deleteUser and userID = " + userID);

  if (userID > 0) {
    //get the connection again

    //changed query
    var query = "DELETE FROM User WHERE userID = ?;";

    //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
    //err1 is the error, rows is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
    connection.query(query, [userID], function (err1, rows, fields) {
      //release the query, don't need access to the database anymore
      //error handling
      if (err1) {
        res.sendStatus(500);
        return;
      }
      //send an empty response, not needing to return anything, or can send a message for clarity
      res.send("successfully deleted");
    });
  }
  else {
    res.status(404).json({ error: "User not found" });
    return
  }
});


router.get('/oldPosts', function (req, res, next) {
  //console.log("i am in the oldPosts requests index.js!!!");
  const branchID = req.query.branchID;
  //const branchName = req.query.branch;
  const orgID = req.query.orgID;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database

  //console.log("connected to pool in org branch requests");

  // query to get the update posts by the branch
  var oldPostsQuery = "SELECT * FROM Updates WHERE branchID = ?";
  connection.query(oldPostsQuery, [branchID], function (err2, rows2) {
    if (err2) {
      //console.log("Error executing branch request query:", err2);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // old update posts found, send back the details
    res.json(rows2);
    return;
  });
});

router.get('/getBranches', function (req, res, next) {
  //console.log("i am in the getBranches requests index.js!!!");
  const orgID = req.session.accountID;
  //console.log("orgID: ", orgID);
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database

  //console.log("connected to pool in org branch requests");
  // First query to get the orgID
  var query = "SELECT * FROM Branch WHERE orgID = ? && instated = 1;";
  connection.query(query, [orgID], function (err1, rows1) {

    if (err1) {
      //console.log("Error executing ID query:", err1);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    //console.log("row length: ", rows1.length);

    if (rows1.length === 0) {
      // Organization not found
      res.status(404).json({ error: "Organisation not found" });
      return;
    }
    //console.log("ALL GOOD WE ARE RETURNING " + rows1);
    res.json(rows1);
    return;
  });
});


router.get('/getOrgName', function (req, res, next) {
  //console.log("i am in the getOrgName requests index.js!!!");
  const orgID = req.session.accountID;
  //console.log("the orgID is " + orgID);
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  //console.log("connected to pool in org branch requests");
  // First query to get the orgID
  var query = "SELECT orgName FROM Organisations WHERE orgID = ?;";
  connection.query(query, [orgID], function (err1, rows1) {

    if (err1) {
      //console.log("Error executing ID query:", err1);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (rows1.length === 0) {
      // Organization not found
      res.status(404).json({ error: "Organization not found" });
      return;
    }
    //console.log("ALL GOOD WE ARE RETURNING " + rows1[0]);
    res.json(rows1[0]);
    return;
  });
});

router.get('/getOrgNameVolunteers', function (req, res, next) {
  console.log("I am in the getOrgName request in index.js!!!");
  const branchID = req.query.selectedBranchID;
  console.log("The branchID is " + branchID);

  console.log("Connected to pool in org branch requests");

  // First query to get the orgID
  if (branchID !== '-1') {
    var query = "SELECT orgID FROM Branch WHERE branchID = ?;";
    connection.query(query, [branchID], function (err1, rows1) {
      if (err1) {
        console.log("Error executing ID query:", err1);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows1.length === 0) {
        // Organization not found
        res.status(404).json({ error: "Organization not found" });
        return;
      }

      var orgID = rows1[0].orgID; // Extract orgID from rows1
      var query = "SELECT orgName FROM Organisations WHERE orgID = ?;";
      connection.query(query, [orgID], function (err2, rows2) {
        if (err2) {
          console.log("Error executing organization name query:", err2);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        if (rows2.length === 0) {
          // Organization name not found
          res.status(404).json({ error: "Organization name not found" });
          return;
        }

        var orgName = rows2[0].orgName; // Extract orgName from rows2
        console.log("Returning organization name:", orgName);
        res.json({ orgName: orgName });
      });
    });
  }
});



router.get('/getOrgLogo', function (req, res, next) {
  //console.log("i am in the getOrgLogo requests index.js!!!");
  const orgID = req.session.accountID;
  //console.log("the orgID is " + orgID);
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  //console.log("connected to pool in org branch requests");
  // First query to get the orgID
  var query = "SELECT imgPath FROM Organisations WHERE orgID = ?;";
  connection.query(query, [orgID], function (err1, rows1) {

    if (err1) {
      //console.log("Error executing ID query:", err1);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (rows1.length === 0) {
      // Organization not found
      res.status(404).json({ error: "Organisation not fsound" });
      return;
    }
    //console.log("ALL GOOD WE ARE RETURNING " + rows1[0].imgPath);
    res.json(rows1[0]);
    return;
  });
});


router.post('/createNewPost', function (req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  // const { branchName, updateName, updateMsg, dateCreated } = req.body;
  const orgID = req.session.accountID;
  const { branchID, updateName, updateMsg, dateCreated } = req.body;
  // //console.log("THE VALUES PARSED TO CREATE A NEW POST ARE " + branchName, orgID, updateName, updateMsg, dateCreated);
  //get the last created and used updateID
  var currUpdateIdQuery = "SELECT updateID FROM Updates ORDER BY updateID DESC LIMIT 1;";

  connection.query(currUpdateIdQuery, function (err1, result) {
    //release the query, don't need access to the database anymore

    //error handling
    if (err1) {
      //console.log("Got error while fetching updateID: ", err1);
      res.sendStatus(500);
      return;
    }

    let currUpdateId = 1;
    if (result.length > 0) {
      currUpdateId = result[0].updateID + 1
    }
    //console.log("the new update id is " + currUpdateId);

    var newPostQuery = "INSERT INTO Updates (updateID, updateName, updateMsg, branchID, dateCreated) VALUES (?, ?, ?, ?, ?);";

    //using our connection apply the query to the database, we need the array [] to be the placeholder values of ? ? ? ? ?
    //err1 is the error, returnVal is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
    connection.query(newPostQuery, [currUpdateId, updateName, updateMsg, branchID, dateCreated], function (err2, returnVal) {

      //error handling
      if (err2) {
        //release the query, don't need access to the database anymore
        //console.log("Got error while inserting new post: ", err2);
        res.sendStatus(500);
        return;
      }

      var allPosts = "SELECT * FROM Updates WHERE branchID = ?";
      connection.query(allPosts, [branchID], function (err2, rows2) {
        if (err2) {
          //console.log("Error executing branch request query:", err2);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        // old update posts found, send back the details
        res.json(rows2);
        return;
      });
    });
  });
});

router.post('/email', function (req, res, next) {
  let info = transporter.sendMail({
    from: "HeartFeltHelpersVolunteering@outlook.com", //sender address
    to: req.body.email, //list of recievers
    subject: req.body.subject, //subject line
    text: req.body.text, //plain text body
    html: req.body.text //html body
  })
  res.send()

});

router.post('/emailUpdate', function (req, res, next) {
  //find the email list
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  //console.log("connected to pool");
  //this is the query which i can change
  var query = "SELECT email FROM User WHERE userID IN (SELECT userID FROM FollowedBranches WHERE branchID = ? AND emailSubscribed = 1);";
  //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
  connection.query(query, [req.body.branchID], function (err1, rows, fields) {

    //close the door of the database, its like a bank vault, once we have opened it and got out the money (using the query) we close it
    if (err1) {
      //console.log("Error executing query:", err1);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (rows.length > 0) {
      // Extract email addresses from the result rows
      const emailList = rows.map(row => row.email);
      // Organization found, send back the details
      let info = transporter.sendMail({
        from: "HeartFeltHelpersVolunteering@outlook.com", //sender address
        to: emailList.join(','), //list of recievers
        subject: req.body.subject, //subject line
        text: req.body.text, //plain text body
        html: req.body.text //html body
      })
    }
    return;
  });
});

router.get('/allUsers', function (req, res, next) {
  //console.log("i am in the allUsers requests index.js!!!");
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database

  // query to get the update posts by the branch
  var oldPostsQuery = "SELECT * FROM User";
  connection.query(oldPostsQuery, function (err2, rows2) {
    if (err2) {
      //console.log("Error executing user request query:", err2);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // old update posts found, send back the details
    res.json(rows2);
    return;
  });
});

router.get('/allOrgs', function (req, res, next) {
  //console.log("i am in the allOrgs requests index.js!!!");
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database

  // query to get the update posts by the branch
  var allOrgs = "SELECT * FROM Organisations;";
  connection.query(allOrgs, function (err2, rows2) {
    if (err2) {
      //console.log("Error executing user request query:", err2);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // old update posts found, send back the details
    res.json(rows2);
    return;
  });
});

//ROUTES LUCY
// sign up user ALSO update session tokens
router.post('/addUser', function (req, res, next) {

  const { first_name, last_name, dob, suburb, state, postcode, country, email, password } = req.body;
  //console.log("Received data ", first_name, last_name, dob, suburb, state, postcode, country, email, password);

  //get connection
  req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      //console.log("error")
      res.sendStatus(500);
      return;
    }

    // check if email already present in user database
    var checkPresent = "SELECT email FROM User WHERE email = ?;";
    connection.query(checkPresent, [email], function (err1, result1) {
      if (err1) {
        connection.release();
        //console.log("Error checking for email: ", err1);
        res.sendStatus(500);
        return;
      }

      //email exists
      if (result1.length > 0) {
        connection.release();
        //console.log("email in use");
        res.status(400).send("email in use");
        return;
      }
      // });

      // check if email already present in org database
      checkPresent = "SELECT email FROM Organisations WHERE email = ?;";
      connection.query(checkPresent, [email], function (err2, result2) {
        if (err2) {
          connection.release();
          //console.log("Error checking for email: ", err2);
          res.sendStatus(500);
          return;
        }

        //email exists
        if (result2.length > 0) {
          connection.release();
          //console.log("email in use");
          res.status(400).send("email in use");
          return;
        }
        // });

        // check if email already present in admin database
        var checkPresent = "SELECT email FROM Admin WHERE email = ?;";
        connection.query(checkPresent, [email], function (err3, result3) {
          if (err3) {
            connection.release();
            //console.log("Error checking for email: ", err3);
            res.sendStatus(500);
            return;
          }

          //email exists
          if (result3.length > 0) {
            connection.release();
            //console.log("email in use");
            res.status(400).send("email in use");
            return;
          }
          // });

          //get last user id
          var mostRecentUserId = "SELECT userID FROM User ORDER BY userID DESC LIMIT 1;";

          connection.query(mostRecentUserId, async function (err4, result) {

            //error handling
            if (err4) {
              connection.release();
              //console.log("Got error while fetching userID: ", err4);
              res.sendStatus(500);
              return;
            }

            let currUserId = 1;
            if (result.length > 0) {
              currUserId = result[0].userID + 1;
            }
            //console.log("the new user id is " + currUserId);

            //hash password
            var hash;

            try {
              hash = await hashPass(password);
            } catch (err) {
              //console.log("error in hash");
              res.sendStatus(500);
              return;
            }

            var query = "INSERT INTO User (userID, firstName, lastName, DOB, suburb, state, postcode, country, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

            connection.query(query, [currUserId, first_name, last_name, dob, suburb, state, postcode, country, email, hash], function (err5, returnVal) {
              connection.release();

              if (err5) {
                //console.log("error inserting user", err5);
                res.sendStatus(500);
                return;
              }

              req.session.user = email;
              req.session.userType = "volunteer";
              req.session.accountID = currUserId;
              //send an empty response, not needing to return anything, or can send a message for clarity
              res.send("successfully added");
              return;

            });

          });
        });
      });

    });

  });

});

//sign up organisation
router.post('/addOrg', function (req, res, next) {

  const { name, email, password, suburb, state, postcode, country } = req.body;
  //console.log("Received data ", name, email, password, suburb, state, postcode, country);

  //get connection
  req.pool.getConnection(function (err, connection) {
    //error handling
    if (err) {
      //console.log("error")
      res.sendStatus(500);
      return;
    }

    // check if email already present in user database
    var checkPresent = "SELECT email FROM User WHERE email = ?;";
    connection.query(checkPresent, [email], function (err1, result1) {
      if (err1) {
        connection.release();
        //console.log("Error checking for email: ", err1);
        res.sendStatus(500);
        return;
      }

      //email exists
      if (result1.length > 0) {
        connection.release();
        //console.log("email in use");
        res.status(400).send("email in use");
        return;
      }
      //  });

      // check if email already present in org database
      checkPresent = "SELECT email FROM Organisations WHERE email = ?;";
      connection.query(checkPresent, [email], function (err2, result2) {
        if (err2) {
          connection.release();
          //console.log("Error checking for email: ", err2);
          res.sendStatus(500);
          return;
        }

        //email exists
        if (result2.length > 0) {
          connection.release();
          //console.log("email in use");
          res.status(400).send("email in use");
          return;
        }
        // });

        // check if email already present in admin database
        var checkPresent = "SELECT email FROM Admin WHERE email = ?;";
        connection.query(checkPresent, [email], function (err3, result3) {
          if (err3) {
            connection.release();
            //console.log("Error checking for email: ", err3);
            res.sendStatus(500);
            return;
          }

          //email exists
          if (result3.length > 0) {
            connection.release();
            //console.log("email in use");
            res.status(400).send("email in use");
            return;
          }
          // });

          checkNamePresent = "SELECT * FROM Organisations WHERE orgName = ?;";
          connection.query(checkNamePresent, [name], function (err42, result42) {
            if (err42) {
              connection.release();
              //console.log("Error checking for orgName: ", err42);
              res.sendStatus(500);
              return;
            }

            //name exists
            if (result42.length > 0) {
              connection.release();
              //console.log("Organisation Name in use");
              res.status(400).send("Organisation Name in use");
              return;
            }

            //get last org id
            var mostRecentOrgId = "SELECT orgID FROM Organisations ORDER BY orgID DESC LIMIT 1;";

            connection.query(mostRecentOrgId, function (err4, result4) {

              //error handling
              if (err4) {
                connection.release();
                //console.log("Got error while fetching orgID: ", err4);
                res.sendStatus(500);
                return;
              }

              let currOrgId = 1;
              if (result4.length > 0) {
                currOrgId = result4[0].orgID + 1;
              }
              //console.log("the new org id is " + currOrgId);

              //get last branch id
              var mostRecentBranchId = "SELECT branchID FROM Branch ORDER BY branchID DESC LIMIT 1;";

              connection.query(mostRecentBranchId, async function (err5, result5) {

                //error handling
                if (err5) {
                  connection.release();
                  //console.log("Got error while fetching branchID: ", err5);
                  res.sendStatus(500);
                  return;
                }

                let currBranchId = 1;
                if (result5.length > 0) {
                  currBranchId = result5[0].branchID + 1;
                }
                //console.log("the new branch id is " + currBranchId);

                //hash password
                var hash;

                try {
                  hash = await hashPass(password);
                } catch (err) {
                  //console.log("error in hash");
                  res.sendStatus(500);
                  return;
                }

                var query = "INSERT INTO Organisations (orgID, orgName, email, password) VALUES (?, ?, ?, ?);";

                connection.query(query, [currOrgId, name, email, hash], function (err6, returnVal) {
                  // connection.release();

                  if (err6) {
                    connection.release();
                    //console.log("error inserting org", err6);
                    res.sendStatus(500);
                    return;
                  }
                  //send an empty response, not needing to return anything, or can send a message for clarity
                  // res.send("organisation successfully added");
                  // return;

                });

                var queryBranch = "INSERT INTO Branch (orgID, branchName, branchID, suburb, state, postcode, country, instated) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";

                connection.query(queryBranch, [currOrgId, name, currBranchId, suburb, state, postcode, country, 1], function (err7, returnVal) {
                  connection.release();

                  if (err7) {
                    //console.log("error inserting branch", err7);
                    res.sendStatus(500);
                    return;
                  }

                  req.session.user = email;
                  req.session.userType = "organisation";
                  req.session.accountID = currOrgId;
                  //console.log(req.session.user, req.session.userType, req.session.accountID);

                  //send an empty response, not needing to return anything, or can send a message for clarity
                  res.send("branch and org successfully added");
                  return;

                });
              });
            });
          });
        });

      });

    });

  });

});


//login
router.post('/login', async function (req, res, next) {

  const { email, password } = req.body;
  //console.log("Received data ", email, password);

  //set session user to email
  req.session.user = req.body.email;

  //get connection
  req.pool.getConnection(function (err, connection) {
    //error handling
    if (err) {
      //console.log("error")
      res.sendStatus(500);
      return;
    }

    var accountQuery = "SELECT userID, password FROM User WHERE email = ?;";
    connection.query(accountQuery, [email], async function (err, rows) {
      if (err) {
        connection.release();
        //console.log("Error finding login", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows.length > 0) {

        //console.log(rows[0].password, password, rows[0].userID);

        //check if password matches, if it doesn't return the doesn't match error, if matches, login
        try {
          if (await deHashPass(rows[0].password, password)) {
            connection.release();
            const id = rows[0].userID;
            req.session.userType = "volunteer";
            req.session.accountID = id;
            //console.log("User id:", id);
            //console.log(req.session.userType, req.session.user);
            res.status(200).json({ userType: 'volunteer' });
            return;
          } else {
            res.status(400).send("Email or password is incorrect");
            return;
          }
        } catch (err) {
          connection.release();
          //console.log("Error validating hash", err);
          res.status(500).json({ error: "Internal Server Error" });
        }

      } else {
        var orgQuery = "SELECT orgID, password FROM Organisations WHERE email = ?;";
        connection.query(orgQuery, [email], async function (err, rows) {
          if (err) {
            connection.release();
            //console.log("Error finding login", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }

          if (rows.length > 0) {

            //console.log(rows[0].password, password, rows[0].userID);

            //check if password matches, if it doesn't return the doesn't match error, if matches, login
            try {
              if (await deHashPass(rows[0].password, password)) {
                connection.release();
                const id = rows[0].orgID;
                //console.log("Org id:", id);
                req.session.userType = "organisation";
                req.session.accountID = id;
                //console.log(req.session.userType, req.session.user);
                res.status(200).json({ userType: 'organisation' });
                return;
              } else {
                res.status(400).send("Email or password is incorrect");
                return;
              }
            } catch (err) {
              connection.release();
              //console.log("Error validating hash", err);
              res.status(500).json({ error: "Internal Server Error" });
            }

          } else {
            var adminQuery = "SELECT adminID, password FROM Admin WHERE email = ?;";
            connection.query(adminQuery, [email], async function (err, rows) {
              connection.release();
              if (err) {
                //console.log("Error finding login", err);
                res.status(500).json({ error: "Internal Server Error" });
                return;
              }

              if (rows.length > 0) {

                //console.log(rows[0].password, password, rows[0].userID);

                //check if password matches, if it doesn't return the doesn't match error, if matches, login
                try {
                  if (await deHashPass(rows[0].password, password)) {
                    const id = rows[0].adminID;
                    //console.log("Admin id:", id);
                    req.session.accountID = id;
                    req.session.userType = "admin";
                    //console.log(req.session.userType, req.session.user);
                    res.status(200).json({ userType: 'admin' });
                    return;
                  } else {
                    res.status(400).send("Email or password is incorrect");
                    return;
                  }
                } catch (err) {
                  connection.release();
                  //console.log("Error validating hash", err);
                  res.status(500).json({ error: "Internal Server Error" });
                }

              } else {
                res.status(400).send("Email or password is incorrect");
                return;
              }
            });
          }
        });
      }
    });
  });

});

//SETTINGS ROUTES
//check duplicate email
router.post('/checkEmail', function (req, res, next) {
  const { email } = req.body;
  //console.log(email);

  //get connection
  req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      //console.log("error")
      res.sendStatus(500);
      return;
    }

    // check if email already present in user database
    var checkPresent = "SELECT email FROM User WHERE email = ?;";
    connection.query(checkPresent, [email], function (err1, result1) {
      if (err1) {
        connection.release();
        //console.log("Error checking for email: ", err1);
        res.sendStatus(500);
        return;
      }

      //email exists
      if (result1.length > 0) {
        connection.release();
        //console.log("email in use");
        res.status(400).send("email in use");
        return;
      }
      // });

      // check if email already present in org database
      checkPresent = "SELECT email FROM Organisations WHERE email = ?;";
      connection.query(checkPresent, [email], function (err2, result2) {
        if (err2) {
          connection.release();
          //console.log("Error checking for email: ", err2);
          res.sendStatus(500);
          return;
        }

        //email exists
        if (result2.length > 0) {
          connection.release();
          //console.log("email in use");
          res.status(400).send("email in use");
          return;
        }
        // });

        // check if email already present in admin database
        var checkPresent = "SELECT email FROM Admin WHERE email = ?;";
        connection.query(checkPresent, [email], function (err3, result3) {
          if (err3) {
            connection.release();
            //console.log("Error checking for email: ", err3);
            res.sendStatus(500);
            return;
          }

          //email exists
          if (result3.length > 0) {
            connection.release();
            //console.log("email in use");
            res.status(400).send("email in use");
            return;
          }
          // });
          res.send();

        });
      });
    });
  });
});

//check password matches in user
router.post('/checkPassword', function (req, res, next) {
  const { password } = req.body;
  //console.log(password);
  var accountID = req.session.accountID;

  //get connection
  req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      //console.log("error")
      res.sendStatus(500);
      return;
    }

    //check if password matches
    var accountQuery = "SELECT password FROM User WHERE userID = ?;";
    await connection.query(accountQuery, [accountID], async function (err, rows) {

      if (err) {
        //connection.release();
        //console.log("Error finding login", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows.length > 0) {
        //check password matches
        try {
          if (await deHashPass(rows[0].password, password)) {
            res.send();
          } else {
            connection.release();
            //console.log("password incorrect !!");
            res.status(400).send("password incorrect");
            return;
          }
        } catch (err) {
          connection.release();
          //console.log("Error validating hash", err);
          res.status(500).json({ error: "Internal Server Error" });
        }
      } else {
        //console.log("Error searching with id", err);
        res.sendStatus(500);
        return;
      }

    });

  });

});

//check password matches in org
router.post('/checkPasswordOrg', function (req, res, next) {
  const { password } = req.body;
  //console.log(password, accountID);
  var accountID = req.session.accountID;

  //get connection
  req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      //console.log("error")
      res.sendStatus(500);
      return;
    }

    //check if password matches
    var accountQuery = "SELECT password FROM Organisations WHERE orgID = ?;";
    await connection.query(accountQuery, [accountID], async function (err, rows) {

      if (err) {
        //connection.release();
        //console.log("Error finding login", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows.length > 0) {
        //check password matches
        try {
          if (await deHashPass(rows[0].password, password)) {
            res.send();
          } else {
            connection.release();
            //console.log("password incorrect !!");
            res.status(400).send("password incorrect");
            return;
          }
        } catch (err) {
          connection.release();
          //console.log("Error validating hash", err);
          res.status(500).json({ error: "Internal Server Error" });
        }
      } else {
        //console.log("Error searching with id", err);
        res.sendStatus(500);
        return;
      }

    });

  });

});

//check password matches in admin
router.post('/checkPasswordAdmin', function (req, res, next) {
  const { password } = req.body;
  //console.log(password, accountID);
  var accountID = req.session.accountID;

  //get connection
  req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      //console.log("error")
      res.sendStatus(500);
      return;
    }

    //check if password matches
    var accountQuery = "SELECT password FROM Admin WHERE adminID = ?;";
    await connection.query(accountQuery, [accountID], async function (err, rows) {

      if (err) {
        //connection.release();
        //console.log("Error finding login", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows.length > 0) {
        //check password matches
        try {
          if (await deHashPass(rows[0].password, password)) {
            res.send();
          } else {
            connection.release();
            //console.log("password incorrect !!");
            res.status(400).send("password incorrect");
            return;
          }
        } catch (err) {
          connection.release();
          //console.log("Error validating hash", err);
          res.status(500).json({ error: "Internal Server Error" });
        }
      } else {
        //console.log("Error searching with id", err);
        res.sendStatus(500);
        return;
      }

    });

  });

});

//update user info ADD EMAIL PREFERENCES
//update user info
router.post('/updateUserInfo', async function (req, res, next) {
  const { email, firstName, lastName, oldPassword, newPassword, suburb, state, postcode, country, checkboxFull, updateEmail, updateName, updatePassword, updateLocation, updateEmailPreference } = req.body;
  const currentEmail = req.session.user;
  const accountID = req.session.accountID;

  //console.log(req.session.user, req.session.userType, accountID, email);

  await req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      //console.log("error")
      res.sendStatus(500);
      return;
    }

    if (updateEmail == 1) {
      const query = 'UPDATE User SET email = ? WHERE email = ?;';

      connection.query(query, [email, currentEmail], function (err, returnVal) {
        //connection.release();

        if (err) {
          //console.log("error inserting new email", err);
          res.sendStatus(500);
          return;
        }
        //console.log("email updated")
      });
    }

    if (updateName == 1) {
      const query = 'UPDATE User SET firstName = ?, lastName = ? WHERE userID = ?;';

      await connection.query(query, [firstName, lastName, accountID], function (err, returnVal) {
        //connection.release();

        if (err) {
          //console.log("error inserting new name", err);
          res.sendStatus(500);
          return;
        }
        //console.log("name updated");
      });

    }

    if (updatePassword == 1) {
      //update password

      //hash password
      var hash;

      try {
        hash = await hashPass(newPassword);
      } catch (err) {
        //console.log("error in hash");
        res.sendStatus(500);
        return;
      }

      const query = 'UPDATE User SET password = ? WHERE userID = ?;';

      await connection.query(query, [hash, accountID], function (err, returnVal) {
        // connection.release();
        if (err) {
          //console.log("error inserting new password", err);
          res.sendStatus(500);
          return;
        }

        //console.log("password updated");
      });
      // });

    }

    if (updateLocation == 1) {
      const query = 'UPDATE User SET suburb = ?, state = ?, postcode = ?, country = ? WHERE userID = ?;';

      await connection.query(query, [suburb, state, postcode, country, accountID], function (err, returnVal) {
        //connection.release();

        if (err) {
          //console.log("error inserting new location", err);
          res.sendStatus(500);
          return;
        }
        //console.log("location updated");
      });

    }

    if (updateEmailPreference == 1) {
      const query = 'UPDATE FollowedBranches SET emailSubscribed = 0 WHERE userID = ?;';

      await connection.query(query, [accountID], function (err, returnVal) {
        //connection.release();

        if (err) {
          //console.log("error updating email preference", err);
          res.sendStatus(500);
          return;
        }
        //console.log("email preference updated");
      });

    }


    //console.log("got to the end");
    //if connection has not been released, release it
    //if ((connection && connection.threadId)) {
    connection.release();
    //}
    if (!res.headersSent) {
      res.sendStatus(200);
    }

  });
});

router.get('/sessionUserType', function (req, res) {
  if (req.session.userType) {
    //console.log("session type: ", req.session.userType);
    res.json({ userType: req.session.userType });
  } else if (req.session.userType == null) {
    res.json({})
  } else {
    res.status(404).json({ error: "cant find sess type" });
  }
});


router.get('/getName', function (req, res) {
  if (req.session.userType) {
    //console.log("session type: ", req.session.userType);
    //console.log("user ID: ", req.session.accountID);

    let id = req.session.accountID;

    let query;
    if (req.session.userType === 'volunteer') {
      query = 'SELECT firstName, lastName FROM User WHERE userID = ?';
    } else if (req.session.userType === 'organisation') {
      query = 'SELECT orgName AS name FROM Organisations WHERE orgID = ?';
    } else if (req.session.userType === 'admin') {
      query = 'SELECT firstName, lastName FROM Admin WHERE adminID = ?';
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      let name;
      if (req.session.userType === 'volunteer' || req.session.userType === 'admin') {
        name = `${results[0].firstName} ${results[0].lastName}`;
      } else if (req.session.userType === 'organisation') {
        name = results[0].name;
      }

      res.json({ name: name });
    });

  } else if (req.session.userType == null) {
    res.json({});
  } else {
    res.status(404).json({ error: "can't find sess type or ID" });
  }
});

//delete user
router.post('/deleteSelfUser', function (req, res, next) {

  const { email, password } = req.body;
  //console.log("Received data ", email, password);

  accountID = req.session.accountID;

  //get connection
  req.pool.getConnection(function (err, connection) {
    //error handling
    if (err) {
      //console.log("error")
      res.sendStatus(500);
      return;
    }

    //check if the email and password match the database and the id of the user who is currently logged in
    var accountQuery = "SELECT password FROM User WHERE email = ? AND userID = ?;";
    connection.query(accountQuery, [email, accountID], async function (err, rows) {
      if (err) {
        connection.release();
        //console.log("Error matching details", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      //matches
      if (rows.length > 0) {

        //check password matches
        try {
          if (await deHashPass(rows[0].password, password)) {
            var query = "DELETE FROM User WHERE userID = ?;";

            //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
            //err1 is the error, rows is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
            connection.query(query, [accountID], function (err1, rows, fields) {
              //release the query, don't need access to the database anymore
              connection.release();
              //error handling
              if (err1) {
                res.sendStatus(500);
                return;
              }
              //log out user
              req.session.user = null;
              req.session.userType = null;
              req.session.accountID = null;

              res.send("successfully deleted");
            });
          } else {
            connection.release();
            //console.log("account details incorrect !!");
            res.status(400).send("account details incorrect");
          }
        } catch (err) {
          connection.release();
          //console.log("Error validating hash", err);
          res.status(500).json({ error: "Internal Server Error" });
        }
      } else {
        //console.log("Error searching with id", err);
        res.sendStatus(500);
        return;
      }

    });
  });
});

//update org info
router.post('/updateOrgInfo', async function (req, res, next) {
  const { email, name, url, oldPassword, newPassword, updateEmail, updateName, updatePassword, updateURL } = req.body;
  const currentEmail = req.session.user;
  const accountID = req.session.accountID;

  //console.log(req.session.user, req.session.userType, accountID, email);

  await req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      //console.log("error")
      res.sendStatus(500);
      return;
    }

    if (updateEmail == 1) {
      const query = 'UPDATE Organisations SET email = ? WHERE email = ?;';

      connection.query(query, [email, currentEmail], function (err, returnVal) {
        //connection.release();

        if (err) {
          //console.log("error inserting new email", err);
          res.sendStatus(500);
          return;
        }
        //console.log("email updated")
      });
    }

    if (updateName == 1) {
      const query = 'UPDATE Organisations SET orgName = ? WHERE orgID = ?;';

      await connection.query(query, [name, accountID], function (err, returnVal) {
        //connection.release();

        if (err) {
          //console.log("error inserting new name", err);
          res.sendStatus(500);
          return;
        }
        //console.log("name updated");
      });

    }

    if (updateURL == 1) {
      const query = 'UPDATE Organisations SET orgSite = ? WHERE orgID = ?;';

      await connection.query(query, [url, accountID], function (err, returnVal) {
        //connection.release();

        if (err) {
          //console.log("error inserting new url", err);
          res.sendStatus(500);
          return;
        }
        //console.log("url updated");
      });

    }

    if (updatePassword == 1) {
      //update password

      //hash password
      var hash;

      try {
        hash = await hashPass(newPassword);
      } catch (err) {
        //console.log("error in hash");
        res.sendStatus(500);
        return;
      }

      const query = 'UPDATE Organisations SET password = ? WHERE orgID = ?;';

      await connection.query(query, [hash, accountID], function (err, returnVal) {
        // connection.release();
        if (err) {
          //console.log("error inserting new password", err);
          res.sendStatus(500);
          return;
        }

        //console.log("password updated");
      });
      // });

    }

    //console.log("got to the end");
    //if connection has not been released, release it
    //if ((connection && connection.threadId)) {
    connection.release();
    //}
    if (!res.headersSent) {
      res.sendStatus(200);
    }

  });
});

//delete org
router.post('/deleteSelfOrg', function (req, res, next) {

  const { email, password } = req.body;
  //console.log("Received data ", email, password);

  accountID = req.session.accountID;

  //get connection
  req.pool.getConnection(function (err, connection) {
    //error handling
    if (err) {
      //console.log("error")
      res.sendStatus(500);
      return;
    }

    //check if the email and password match the database and the id of the user who is currently logged in
    var accountQuery = "SELECT password FROM Organisations WHERE email = ? AND orgID = ?;";
    connection.query(accountQuery, [email, accountID], async function (err, rows) {
      if (err) {
        connection.release();
        //console.log("Error matching details", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      //matches
      if (rows.length > 0) {

        //check password matches
        try {
          if (await deHashPass(rows[0].password, password)) {
            var query = "DELETE FROM Organisations WHERE orgID = ?;";

            //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
            //err1 is the error, rows is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
            connection.query(query, [accountID], function (err1, rows, fields) {
              //release the query, don't need access to the database anymore
              connection.release();
              //error handling
              if (err1) {
                res.sendStatus(500);
                return;
              }
              //log out user
              req.session.user = null;
              req.session.userType = null;
              req.session.accountID = null;

              res.send("successfully deleted");
            });
          } else {
            connection.release();
            //console.log("account details incorrect !!");
            res.status(400).send("account details incorrect");
          }
        } catch (err) {
          connection.release();
          //console.log("Error validating hash", err);
          res.status(500).json({ error: "Internal Server Error" });
        }
      } else {
        //console.log("Error searching with id", err);
        res.sendStatus(500);
        return;
      }

    });
  });
});

//update admin info
router.post('/updateAdminInfo', async function (req, res, next) {
  const { email, firstName, lastName, oldPassword, newPassword, updateEmail, updateName, updatePassword } = req.body;
  const currentEmail = req.session.user;
  const accountID = req.session.accountID;

  //console.log(req.session.user, req.session.userType, accountID, email);

  await req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      //console.log("error")
      res.sendStatus(500);
      return;
    }

    if (updateEmail == 1) {
      const query = 'UPDATE Admin SET email = ? WHERE email = ?;';

      connection.query(query, [email, currentEmail], function (err, returnVal) {
        //connection.release();

        if (err) {
          //console.log("error inserting new email", err);
          res.sendStatus(500);
          return;
        }
        //console.log("email updated")
      });
    }

    if (updateName == 1) {
      const query = 'UPDATE Admin SET firstName = ?, lastName = ? WHERE adminID = ?;';

      await connection.query(query, [firstName, lastName, accountID], function (err, returnVal) {
        //connection.release();

        if (err) {
          //console.log("error inserting new name", err);
          res.sendStatus(500);
          return;
        }
        //console.log("name updated");
      });

    }

    if (updatePassword == 1) {
      //update password

      //hash password
      var hash;

      try {
        hash = await hashPass(newPassword);
      } catch (err) {
        //console.log("error in hash");
        res.sendStatus(500);
        return;
      }

      const query = 'UPDATE Admin SET password = ? WHERE adminID = ?;';

      await connection.query(query, [hash, accountID], function (err, returnVal) {
        // connection.release();
        if (err) {
          //console.log("error inserting new password", err);
          res.sendStatus(500);
          return;
        }

        //console.log("password updated");
      });
      // });

    }

    //console.log("got to the end");
    //if connection has not been released, release it
    //if ((connection && connection.threadId)) {
    connection.release();
    //}
    if (!res.headersSent) {
      res.sendStatus(200);
    }

  });
});

//delete admin
router.post('/deleteSelfAdmin', function (req, res, next) {

  const { email, password } = req.body;
  //console.log("Received data ", email, password);

  accountID = req.session.accountID;

  //get connection
  req.pool.getConnection(function (err, connection) {
    //error handling
    if (err) {
      //console.log("error")
      res.sendStatus(500);
      return;
    }

    //check if the email and password match the database and the id of the user who is currently logged in
    var accountQuery = "SELECT password FROM Admin WHERE email = ? AND adminID = ?;";
    connection.query(accountQuery, [email, accountID], async function (err, rows) {
      if (err) {
        connection.release();
        //console.log("Error matching details", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      //matches
      if (rows.length > 0) {

        //check password matches
        try {
          if (await deHashPass(rows[0].password, password)) {
            var query = "DELETE FROM Admin WHERE adminID = ?;";

            //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
            //err1 is the error, rows is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
            connection.query(query, [accountID], function (err1, rows, fields) {
              //release the query, don't need access to the database anymore
              connection.release();
              //error handling
              if (err1) {
                res.sendStatus(500);
                return;
              }
              //log out user
              req.session.user = null;
              req.session.userType = null;
              req.session.accountID = null;

              res.send("successfully deleted");
            });
          } else {
            connection.release();
            //console.log("account details incorrect !!");
            res.status(400).send("account details incorrect");
          }
        } catch (err) {
          connection.release();
          //console.log("Error validating hash", err);
          res.status(500).json({ error: "Internal Server Error" });
        }
      } else {
        //console.log("Error searching with id", err);
        res.sendStatus(500);
        return;
      }

    });
  });
});

router.get('/checkVerified', function (req, res, next) {
  const query = "SELECT * FROM Organisations WHERE description IS NULL OR description = '' OR imgPath IS NULL OR imgPath = '' OR orgSite IS NULL OR orgSite = '';";
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (results.length > 0) {
      // field empty? send false
      res.json({ verified: false });
    } else {
      // verified? send true
      res.json({ verified: true });
    }
  })
});

router.post('/uploadLogo', upload.single('fileName'), (req, res) => {
  //console.log("image uploaded successfully!");
  let filePath = req.file.path;
  let orgID = req.session.accountID;
  let query = `UPDATE Organisations SET imgPath = ? WHERE orgID = ?`;
  connection.query(query, [filePath, orgID], function (err, result) {
    if (err) {
      console.error("Error updating path:", err);
      res.status(500).send("Error updating path");
    } else {
      //console.log("path updated successfully");
      res.sendStatus(200);
    }
  });
});

router.post('/uploadDescLink', function (req, res, next) {
  //console.log("AHHHHH");
  const { desc, link } = req.body;
  let orgID = req.session.accountID;
  if (!desc || !link) {
    console.error("Description or link missing in request");
    return res.status(400).json({ error: "Description or link missing in request" });
  }
  const query = 'UPDATE Organisations SET description = ?, orgSite = ? WHERE orgID = ?';
  connection.query(query, [desc, link, orgID], function (err, result) {
    if (err) {
      console.error("Error updating description and link:", err);
      res.status(500).json({ error: "Error updating description and link" });
    } else {
      //console.log("Description and link updated successfully");
      res.json({ message: "Description and link updated successfully" });
    }
  });
});


router.get('/getUpdates', (req, res) => {
  let organisationID = req.session.accountID;
  //console.log("orgID=", organisationID);
  //console.log("IM IN GET UPDATES");
  let branchID = req.query.branchID;
  //console.log("BRANCHID: ", branchID);



  const query = `
      SELECT u.*
      FROM Updates u
      JOIN Branch b ON u.branchID = b.branchID
      WHERE b.orgID = ? AND u.branchID = ?
      ORDER BY u.dateCreated DESC
      LIMIT 3
    `;

  connection.query(query, [organisationID, branchID], function (err, rows) {

    if (err) {
      console.error('error fetching updates:', err);
      res.status(500).json({ error: 'internal server error' });
      return;
    }

    if (rows.length === 0) {
      //console.log("THERE IS NO UpDATES");
    }

    res.json(rows); // send updates as JSON response
  });
});


router.get('/getPosts', (req, res) => {
  let organisationID = req.session.accountID;
  //console.log("orgID=", organisationID);
  //console.log("IM IN GET POSTS");
  let branchID = req.query.branchID;
  //console.log("BRANCHID: ", branchID);


  const query = `
      SELECT o.*
      FROM Opportunities o
      JOIN Branch b ON o.branchID = b.branchID
      WHERE b.orgID = ? AND o.branchID = ?
      ORDER BY o.dates DESC
      LIMIT 3
    `;

  connection.query(query, [organisationID, branchID], function (err, rows) {

    if (err) {
      console.error('error fetching posts:', err);
      res.status(500).json({ error: 'internal server error' });
      return;
    }

    if (rows.length === 0) {
      //console.log("THERE IS NO POSTS");
    }

    res.json(rows); // send updates as JSON response
  });
});

//login with google

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID');

router.post('/loginGoogle', async function (req, res, next) {
  //console.log("/loginGoogle running");

  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: req.body.client_id
    });

    const payload = ticket.getPayload();
    //console.log(payload['email'], payload['name']);
    const email = payload['email'];

    req.pool.getConnection(function (err, connection) {
      if (err) {
        //console.log("error");
        res.sendStatus(500);
        return;
      }

      // function to handle response and release connection to prevent accidentally releasing too many times
      const handleResponse = (status, message) => {
        connection.release();
        res.status(status).send(message);
      };

      // check if email already present in user database
      let checkPresent = "SELECT email, userID FROM User WHERE email = ? AND googleUser = 1;";
      connection.query(checkPresent, [email], function (err1, result1) {
        if (err1) {
          //console.log("Error checking for email: ", err1);
          handleResponse(500, "Error checking for email");
          return;
        }

        if (result1.length > 0) {
          //console.log("email in users");
          req.session.userType = "volunteer";
          req.session.accountID = result1[0].userID;
          req.session.user = result1[0].email;
          handleResponse(200, "Login successful");
          return;
        }

        // check if email already present in org database
        checkPresent = "SELECT email, orgID FROM Organisations WHERE email = ? AND googleUser = 1;";
        connection.query(checkPresent, [email], function (err2, result2) {
          if (err2) {
            //console.log("Error checking for email: ", err2);
            handleResponse(500, "Error checking for email");
            return;
          }

          if (result2.length > 0) {
            //console.log("email in organisation");
            req.session.userType = "organisation";
            req.session.accountID = result2[0].orgID;
            req.session.user = result2[0].email;
            handleResponse(200, "Login successful");
            return;
          }

          // check if email already present in admin database
          checkPresent = "SELECT email, adminID FROM Admin WHERE email = ?;";
          connection.query(checkPresent, [email], function (err3, result3) {
            if (err3) {
              //console.log("Error checking for email: ", err3);
              handleResponse(500, "Error checking for email");
              return;
            }

            if (result3.length > 0) {
              //console.log("email in admin");
              req.session.userType = "admin";
              req.session.accountID = result3[0].adminID;
              req.session.user = result3[0].email;
              handleResponse(200, "Login successful");
              return;
            }

            //console.log("email not in any database");
            handleResponse(400, "You need to sign up before signing in");
          });
        });
      });
    });
  } catch (error) {
    console.error("Error logging in with Google:", error);
    res.status(500).json({ error: "something went wrong with google login" });
  }
});


//sign up with google for user
router.post('/signUpGoogleUser', async function (req, res, next) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: req.body.client_id
    });

    const payload = ticket.getPayload();
    //console.log(payload['email'], payload['name']);
    const email = payload['email'];
    const name = payload['name'];
    const space = "";

    // const dob = payload['birthdate'];

    //get connection
    req.pool.getConnection(async function (err, connection) {
      //error handling
      if (err) {
        //console.log("error")
        res.sendStatus(500);
        return;
      }

      // check if email already present in user database
      var checkPresent = "SELECT email FROM User WHERE email = ?;";
      connection.query(checkPresent, [email], function (err1, result1) {
        if (err1) {
          connection.release();
          //console.log("Error checking for email: ", err1);
          res.sendStatus(500);
          return;
        }

        //email exists
        if (result1.length > 0) {
          connection.release();
          //console.log("email in use");
          res.status(400).send("email in use");
          return;
        }
        // });

        // check if email already present in org database
        checkPresent = "SELECT email FROM Organisations WHERE email = ?;";
        connection.query(checkPresent, [email], function (err2, result2) {
          if (err2) {
            connection.release();
            //console.log("Error checking for email: ", err2);
            res.sendStatus(500);
            return;
          }

          //email exists
          if (result2.length > 0) {
            connection.release();
            //console.log("email in use");
            res.status(400).send("email in use");
            return;
          }
          // });

          // check if email already present in admin database
          var checkPresent = "SELECT email FROM Admin WHERE email = ?;";
          connection.query(checkPresent, [email], function (err3, result3) {
            if (err3) {
              connection.release();
              //console.log("Error checking for email: ", err3);
              res.sendStatus(500);
              return;
            }

            //email exists
            if (result3.length > 0) {
              connection.release();
              //console.log("email in use");
              res.status(400).send("email in use");
              return;
            }
            // });

            //get last user id
            var mostRecentUserId = "SELECT userID FROM User ORDER BY userID DESC LIMIT 1;";

            connection.query(mostRecentUserId, async function (err4, result) {

              //error handling
              if (err4) {
                connection.release();
                //console.log("Got error while fetching userID: ", err4);
                res.sendStatus(500);
                return;
              }

              let currUserId = 1;
              if (result.length > 0) {
                currUserId = result[0].userID + 1;
              }
              //console.log("the new user id is " + currUserId);

              var query = "INSERT INTO User (userID, firstName, lastName, email, googleUser) VALUES (?, ?, ?, ?, ?);";

              connection.query(query, [currUserId, name, space, email, 1], function (err5, returnVal) {
                connection.release();

                if (err5) {
                  //console.log("error inserting user", err5);
                  res.sendStatus(500);
                  return;
                }

                req.session.user = email;
                req.session.userType = "volunteer";
                req.session.accountID = currUserId;
                //send an empty response, not needing to return anything, or can send a message for clarity
                res.send("successfully added");
                return;

              });

            });
          });
        });

      });

    });

  } catch (error) {
    console.error("Error logging in with Google:", error);
    res.status(500).json({ error: "something went wrong with google login" });
  }
});

//sign up with google for organisation
router.post('/signUpGoogleOrg', async function (req, res, next) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: req.body.client_id
    });

    const payload = ticket.getPayload();
    //console.log(payload['email'], payload['name']);
    const email = payload['email'];
    const name = payload['name'];
    // const dob = payload['birthdate'];

    //get connection
    req.pool.getConnection(async function (err, connection) {
      //error handling
      if (err) {
        //console.log("error")
        res.sendStatus(500);
        return;
      }

      // check if email already present in user database
      var checkPresent = "SELECT email FROM User WHERE email = ?;";
      connection.query(checkPresent, [email], function (err1, result1) {
        if (err1) {
          connection.release();
          //console.log("Error checking for email: ", err1);
          res.sendStatus(500);
          return;
        }

        //email exists
        if (result1.length > 0) {
          connection.release();
          //console.log("email in use");
          res.status(400).send("email in use");
          return;
        }
        // });

        // check if email already present in org database
        checkPresent = "SELECT email FROM Organisations WHERE email = ?;";
        connection.query(checkPresent, [email], function (err2, result2) {
          if (err2) {
            connection.release();
            //console.log("Error checking for email: ", err2);
            res.sendStatus(500);
            return;
          }

          //email exists
          if (result2.length > 0) {
            connection.release();
            //console.log("email in use");
            res.status(400).send("email in use");
            return;
          }
          // });

          // check if email already present in admin database
          var checkPresent = "SELECT email FROM Admin WHERE email = ?;";
          connection.query(checkPresent, [email], function (err3, result3) {
            if (err3) {
              connection.release();
              //console.log("Error checking for email: ", err3);
              res.sendStatus(500);
              return;
            }

            //email exists
            if (result3.length > 0) {
              connection.release();
              //console.log("email in use");
              res.status(400).send("email in use");
              return;
            }

            // check if name already present in org database NEW
            var checkPresent = "SELECT orgName FROM Organisations WHERE orgName = ?;";
            connection.query(checkPresent, [name], function (err3, result3) {
              if (err3) {
                connection.release();
                //console.log("Error checking for name: ", err3);
                res.sendStatus(500);
                return;
              }

              //name already exists
              if (result3.length > 0) {
                connection.release();
                //console.log("name in use");
                res.status(400).send("name in use");
                return;
              }
              // }); end of NEW
              // });

              //get last user id
              var mostRecentOrgId = "SELECT orgID FROM Organisations ORDER BY orgID DESC LIMIT 1;";

              connection.query(mostRecentOrgId, async function (err4, result) {

                //error handling
                if (err4) {
                  connection.release();
                  //console.log("Got error while fetching orgID: ", err4);
                  res.sendStatus(500);
                  return;
                }

                let currOrgId = 1;
                if (result.length > 0) {
                  currOrgId = result[0].orgID + 1;
                }
                //console.log("the new org id is " + currOrgId);

                //get last branch id
                var mostRecentBranchId = "SELECT branchID FROM Branch ORDER BY branchID DESC LIMIT 1;";

                connection.query(mostRecentBranchId, async function (err5, result5) {

                  //error handling
                  if (err5) {
                    connection.release();
                    //console.log("Got error while fetching branchID: ", err5);
                    res.sendStatus(500);
                    return;
                  }

                  let currBranchId = 1;
                  if (result5.length > 0) {
                    currBranchId = result5[0].branchID + 1;
                  }
                  //console.log("the new branch id is " + currBranchId);

                  var query = "INSERT INTO Organisations (orgID, orgName, email, googleUser) VALUES (?, ?, ?, ?);";

                  connection.query(query, [currOrgId, name, email, 1], function (err5, returnVal) {
                    //connection.release();

                    if (err5) {
                      //console.log("error inserting user", err5);
                      res.sendStatus(500);
                      return;
                    }

                    var queryBranch = "INSERT INTO Branch (orgID, branchName, branchID, instated) VALUES (?, ?, ?, ?);";

                    connection.query(queryBranch, [currOrgId, "Main Branch", currBranchId, 1], function (err7, returnVal) {
                      connection.release();

                      if (err7) {
                        //console.log("error inserting branch", err7);
                        res.sendStatus(500);
                        return;
                      }

                      req.session.user = email;
                      req.session.userType = "organisation";
                      req.session.accountID = currOrgId;
                      //send an empty response, not needing to return anything, or can send a message for clarity
                      res.send("successfully added");
                      return;
                    });
                  });
                });
              });
            });
          });
        });

      });

    });

  } catch (error) {
    console.error("Error signing up with Google:", error);
    res.status(500).json({ error: "something went wrong with google signup" });
  }
});

router.post('/logOut', function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      //console.log("error destroying session: ", err);
      res.status(500).send("failed to log out");
    } else {
      res.status(200).send("logged out");
    }
  });
});

router.get('/getNumVolunteers', function (req, res, next) {
  // first get the branch id
  //console.log("GETTING NUM OF VOLUNTEERS OF EACH BRANCH");
  let organisationID = req.session.accountID;
  //console.log("orgID=", organisationID);
  let branchID = req.query.branchID;
  //console.log("BRANCHID: ", branchID);

  const query = `
    SELECT COUNT(DISTINCT fb.userID) AS follower_count
    FROM FollowedBranches fb
    JOIN Branch b ON fb.branchID = b.branchID
    WHERE b.branchID = ? AND b.orgID = ?;`;

  connection.query(query, [branchID, organisationID], function (err, count) {

    if (err) {
      console.error('error fetching updates:', err);
      res.status(500).json({ error: 'internal server error' });
      return;
    }
    const followerCount = count[0].follower_count || 0;
    //console.log("the number of volunteers: ", followerCount);
    res.json({ followerCount }); // send updates as JSON response
  });
})

router.get('/getBranchVolunteers', function (req, res, next) {
  // first get the branch id
  //console.log("GETTING ALL VOLUNTEERS");
  let organisationID = req.session.accountID;
  //console.log("orgID=", organisationID);
  let branchID = req.query.branchID;
  //console.log("BRANCHID: ", branchID);

  const query = `
    SELECT u.firstName, u.lastName, u.email, u.userID
    FROM FollowedBranches fb
    JOIN User u ON fb.userID = u.userID
    JOIN Branch b ON fb.branchID = b.branchID
    WHERE b.branchID = ? AND b.orgID = ?;`;

  connection.query(query, [branchID, organisationID], function (err, volunteers) {

    if (err) {
      console.error('error fetching updates:', err);
      res.status(500).json({ error: 'internal server error' });
      return;
    }
    //console.log("yay, we're getting the branch volunteers now!!!");
    res.json(volunteers);
  });
})

router.post('/removeVolunteer/:branchID/:volunteerID', function (req, res, next) {
  //console.log("REMOVE VOLUNTEER")
  // get user ID and branch ID and org ID
  let branchID = req.params.branchID;
  let userID = req.params.volunteerID;
  //console.log("branch ID: ", branchID);
  //console.log("user ID: ", userID);

  const query = `
        DELETE FROM FollowedBranches
        WHERE userID = ? AND branchID = ?`;

  connection.query(query, [userID, branchID], function (err, result) {
    if (err) {
      console.error('Error removing volunteer:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      //console.log('Volunteer removed successfully');
      res.status(200).json({ message: 'Volunteer removed successfully' });
    }
  });
});

router.post('/regBranch', function (req, res, next) {
  //console.log("IN REGISTER BRANCH")
  // get user ID and branch ID and org ID

  let orgID = req.session.accountID;

  const { name, suburb, state, postcode, country } = req.body;
  //console.log("values in new branch: " + name + suburb + state + postcode + country)

  // get the last query ID
  var currBranchIDQuery = "SELECT MAX(branchID) AS highestBranchID FROM Branch;";

  connection.query(currBranchIDQuery, async function (err1, result) {
    let highestBranchID = result[0].highestBranchID || 0;
    let newBranchID = highestBranchID + 1;

    let query = 'INSERT INTO Branch (branchID, branchName, suburb, state, postcode, country, orgID, instated) VALUES (?, ?, ?, ?, ?, ?, ?, 0)';

    connection.query(query,
      [newBranchID, name, suburb, state, postcode, country, orgID], // Assuming orgID is hardcoded for demonstration
      function (err, result) {
        if (err) {
          console.error('Error registering branch:', err);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          //console.log('Branch registered successfully');
          res.status(200).json({ message: 'Branch registered successfully' });
        }
      }
    );
  })

});

// gettinga ll organisations
router.post("/searchOrgs", function (req, res, next) {
  // get inputs
  const { location, name } = req.body;
  let query = `
        SELECT
            Branch.branchID,
            Branch.branchName,
            Branch.suburb,
            Branch.state,
            Branch.postcode,
            Branch.country,
            Branch.orgID,
            Organisations.orgName,
            Organisations.description,
            Organisations.imgPath,
            CASE
                WHEN FollowedBranches.userID IS NOT NULL THEN true
                ELSE false
            END AS joined
        FROM
            Branch
        JOIN
            Organisations ON Branch.orgID = Organisations.orgID
        LEFT JOIN
            FollowedBranches ON Branch.branchID = FollowedBranches.branchID AND FollowedBranches.userID = ?
        WHERE
            Branch.instated = 1
    `;
  let userID = req.session.accountID;
  let queryParams = [userID];

  if (location) {
    query += ` AND (Branch.suburb LIKE ? OR Branch.state LIKE ? OR Branch.country LIKE ?)`;
    queryParams.push(`%${location}%`, `%${location}%`, `%${location}%`);
  }

  if (name) {
    query += ` AND Organisations.orgName LIKE ?`;
    queryParams.push(`%${name}%`);
  }

  connection.query(query, queryParams, function (err, results) {
    if (err) {
      console.error('Error fetching branches:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
})

router.post("/joinOrgBranch", function (req, res, next) {
  // first get user ID, branch ID and org ID
  let userID = req.session.accountID;
  const { branchID } = req.body;

  // insert query to follow the branch
  let query = `
    INSERT INTO FollowedBranches (userID, branchID, emailSubscribed)
    VALUES (?, ?, 1)
  `;
  let queryParams = [userID, branchID];
  connection.query(query, queryParams, function (err, results) {
    if (err) {
      console.error('Error joining branch:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ message: 'Successfully joined branch' });
  });
})

router.post("/unjoinOrgBranch", function (req, res, next) {
  // first get user ID, branch ID and org ID
  let userID = req.session.accountID;
  const { branchID } = req.body;

  let query = "DELETE FROM FollowedBranches WHERE userID = ? AND branchID = ?";
  connection.query(query, [userID, branchID], function (err, result) {
    if (err) {
      console.error('Error unjoining branch:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Successfully unjoined branch' });
  });
})

router.get('/getPostsVolunteer', function (req, res, next) {
  // get the followed updates depending on the branch

  let branchID = req.query.branchID;
  let userID = req.session.accountID;
  //all updates from all branches

  let sqlQuery = `
    SELECT
        Updates.*,
        Organisations.orgName,
        Branch.branchName,
        Organisations.imgPath
    FROM
        Updates
    JOIN
        Branch ON Updates.branchID = Branch.branchID
    JOIN
        Organisations ON Branch.orgID = Organisations.orgID
    LEFT JOIN
        FollowedBranches ON Updates.branchID = FollowedBranches.branchID
            AND FollowedBranches.userID = ?
    WHERE
        Updates.private = 0
        OR
        (Updates.private = 1 AND FollowedBranches.userID IS NOT NULL);
    `;
  // Construct the SQL query to fetch posts based on branchID
  if (branchID !== '-1') {
    console.log("NEW QUERY");
    sqlQuery = `
      SELECT Updates.*, Organisations.orgName,
      Branch.branchName, Organisations.imgPath
      FROM Updates
      JOIN Branch ON Updates.branchID = Branch.branchID
      JOIN Organisations ON Branch.orgID = Organisations.orgID
      WHERE Updates.branchID = ?`;
  }

  // Execute the SQL query
  if (branchID === '-1') {
    connection.query(sqlQuery, [userID], (err, results) => {
      if (err) {
        // Handle errors
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Failed to fetch posts" });
      } else {
        // Send the fetched posts as JSON response
        res.json(results);
      }
    });
  } else {
    connection.query(sqlQuery, [branchID], (err, results) => {
      if (err) {
        // Handle errors
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Failed to fetch posts" });
      } else {
        // Send the fetched posts as JSON response
        res.json(results);
      }
    });
  }
})


router.get('/getFollowedBranch', function (req, res, next) {
  // get the followed updates depending on the branch
  let userID = req.session.accountID;
  // Construct the SQL query to fetch posts based on branchID
  let sqlQuery = `
        SELECT Branch.branchID, Branch.branchName, Branch.suburb, Branch.state, Branch.postcode, Branch.country, Organisations.orgName
        FROM Branch
        INNER JOIN FollowedBranches ON Branch.branchID = FollowedBranches.branchID
        INNER JOIN Organisations ON Branch.orgID = Organisations.orgID
        WHERE FollowedBranches.userID = ${userID}`;
  // Execute the SQL query
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      // Handle errors
      console.error("Error fetching followed branches:", err);
      res.status(500).json({ error: "Failed to fetch followed branches" });
    } else {
      // Send the fetched followed branches as JSON response
      res.json(results);
    }
  });
})

router.post('/findRSVP', function (req, res, next) {
  const { commitments, tags, location } = req.body;
  const userID = req.session.accountID;

  // Construct the WHERE clause of the query based on the provided criteria
  let whereClause = '';

  // Add conditions for commitments
  if (commitments && commitments.length > 0) {
    const commitmentConditions = commitments.map(commitment => `commitment LIKE '%${commitment.text}%'`);
    whereClause += `(${commitmentConditions.join(' OR ')})`;
  }

  // Add conditions for tags
  if (tags && tags.length > 0) {
    const tagConditions = tags.map(tag => `tags LIKE '%${tag.text}%'`);
    if (whereClause) {
      whereClause += ' OR ';
    }
    whereClause += `(${tagConditions.join(' OR ')})`;
  }

  // Add conditions for location
  if (location) {
    if (whereClause) {
      whereClause += ' OR ';
    }
    whereClause += `address LIKE '%${location}%'`;
  }

  // Construct the SQL query with the WHERE clause and join operation
  let query = `
    SELECT *
    FROM Opportunities AS o
    JOIN RSVPD AS r ON o.oppID = r.oppID
    WHERE r.userID = ${userID}
  `;

  // Add the WHERE clause conditions if they exist
  if (whereClause.length > 0) {
    query += ` AND (${whereClause})`;
  }

  // Execute the query
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'An error occurred while searching for opportunities' });
      return;
    }
    res.json(results);
  });
});

router.get('/checkGoogleUser', function (req, res, next) {
  let accID = req.session.accountID;

  //query to extract googleUser value
  let query = `SELECT googleUser FROM User WHERE userID = ${accID}`;

  // Execute the SQL query
  connection.query(query, (err, results) => {
    if (err) {
      // Handle errors
      console.error("Error fetching googleUser", err);
      res.status(500).json({ error: "Failed to get googleUser" });
    } else {
      // Send the fetched followed branches as JSON response
      res.json(results);
    }
  });
})

router.get('/checkGoogleOrg', function (req, res, next) {
  let accID = req.session.accountID;

  //query to extract googleUser value
  let query = `SELECT googleUser FROM Organisations WHERE orgID = ${accID}`;

  // Execute the SQL query
  connection.query(query, (err, results) => {
    if (err) {
      // Handle errors
      console.error("Error fetching googleUser", err);
      res.status(500).json({ error: "Failed to get googleUser" });
    } else {
      // Send the fetched followed branches as JSON response
      res.json(results);
    }
  });
})

router.get('/getRSVPD', function (req, res, next) {
  const userID = req.session.accountID;

  const query = `
    SELECT o.*, b.branchName, b.suburb AS branchSuburb, b.state AS branchState, org.orgName AS orgName
    FROM Opportunities AS o
    JOIN RSVPD AS r ON o.oppID = r.oppID
    JOIN Branch AS b ON o.branchID = b.branchID
    JOIN Organisations AS org ON b.orgID = org.orgID
    WHERE r.userID = ?
  `;

  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'An error occurred while retrieving opportunities' });
      return;
    }
    res.json(results);
  });
})

router.post('/deleteGoogleUser', function (req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const userID = req.session.accountID;

  //console.log("went into /deleteUser and userID = " + userID);

  if (userID > 0) {
    //get the connection again

    //changed query
    var query = "DELETE FROM User WHERE userID = ?;";

    //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
    //err1 is the error, rows is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
    connection.query(query, [userID], function (err1, rows, fields) {
      //release the query, don't need access to the database anymore
      //error handling
      if (err1) {
        res.sendStatus(500);
        return;
      }
      //send an empty response, not needing to return anything, or can send a message for clarity
      req.session.user = null;
      req.session.userType = null;
      req.session.accountID = null;
      res.send("successfully deleted");
    });
  }
  else {
    res.status(404).json({ error: "User not found" });
    return
  }
});

router.post('/deleteGoogleOrg', function (req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const orgID = req.session.accountID;

  //console.log("went into /deleteOrg and orgID = " + orgID);

  if (orgID > 0) {
    //get the connection again

    //changed query
    var query = "DELETE FROM Organisations WHERE orgID = ?;";

    //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
    //err1 is the error, rows is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
    connection.query(query, [orgID], function (err1, rows, fields) {
      //release the query, don't need access to the database anymore
      //error handling
      if (err1) {
        res.sendStatus(500);
        return;
      }
      //send an empty response, not needing to return anything, or can send a message for clarity
      req.session.user = null;
      req.session.userType = null;
      req.session.accountID = null;
      res.send("successfully deleted");
    });
  }
  else {
    res.status(404).json({ error: "User not found" });
    return
  }
});

router.get('/searchPosts', function (req, res, next) {
  console.log("i am here now!!!");

  const categories = req.query.categories;
  const commitment = req.query.commitment;
  const location = req.query.location;
  console.log("thingys");
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got error!!!!");
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool");
    //this is the query which i can change


    let query = `SELECT oppID,
      oppName,
      tags,
      dates,
      address,
      commitment,
      suitability,
      training,
      requirements,
      thumbnail,
      Opportunities.description,
      Opportunities.branchID,
      branchName,
      org.orgName as organisationName,
      org.imgPath
      FROM Opportunities
      JOIN Branch b ON Opportunities.branchID = b.branchID
      JOIN Organisations org ON org.orgID = b.orgID
      WHERE 1=1`; // Adding a dummy condition to simplify appending AND conditions

    const queryParams = [];

    if (categories) {
      query += ' AND tags LIKE CONCAT(\'%\', ?, \'%\')';
      queryParams.push(categories);
    }

    if (commitment) {
      query += ' AND commitment LIKE CONCAT(\'%\', ?, \'%\')';
      queryParams.push(commitment);
    }

    if (location) {
      query += ' AND address LIKE CONCAT(\'%\', ?, \'%\')';
      queryParams.push(location);
    }

    query += ';';


    //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
    connection.query(query, queryParams, function (err1, rows, fields) {
      // Close the connection
      console.log(query);
      connection.release();
      if (err1) {
        console.log("Error executing query:", err1);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows.length === 0) {
        // No results found
        res.status(404).json({ error: "Opps not found" });
        return;
      }

      // Results found, send back the details
      res.json(rows);
    });
  });
});

router.get('/searchSpecificPost', function (req, res, next) {
  console.log("new page laoded");

  const ID = req.query.id;
  console.log(ID);
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got error!!!!");
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool");
    //this is the query which i can change

    let query = `SELECT oppName,
      tags,
      address,
      commitment,
      suitability,
      training,
      requirements,
      thumbnail,
      Opportunities.description,
      Opportunities.branchID,
      branchName,
      org.orgName as organisationName,
      org.imgPath
      FROM Opportunities
      JOIN Branch b ON Opportunities.branchID = b.branchID
      JOIN Organisations org ON org.orgID = b.orgID
      WHERE oppID = ?;`; // Adding a dummy condition to simplify appending AND conditions

    //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
    connection.query(query, [ID], function (err1, rows, fields) {
      // Close the connection
      console.log(query);
      connection.release();
      if (err1) {
        console.log("Error executing query:", err1);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows.length === 0) {
        // No results found
        res.status(404).json({ error: "Opp not found" });
        return;
      }
      res.json(rows[0]);
    });
  });
});

router.post('/addRSVP', (req, res) => {
  const { oppID } = req.body;
  const userID = req.session.accountID;

  req.pool.getConnection(function (err, connection) {
    if (!userID || !oppID) {
      return res.status(400).send({ error: true, message: 'Please provide userID and oppID' });
    }
    const check = 'SELECT * FROM RSVPD WHERE userID = ? AND oppID = ?;';
    connection.query(check, [userID, oppID], (err, reults) => {
      if (err) {
        console.error('Error checking RSVPD:', err);
        return res.status(500).send({ error: true, message: 'Database insertion failed' });
      }
      if (reults.length > 0) {
        return res.status(409).send({ error: true, message: 'RSVP already exists' });
      }

      const query = 'INSERT INTO RSVPD (userID, oppID) VALUES (?, ?);';
      connection.query(query, [userID, oppID], (err, results) => {
        if (err) {
          console.error('Error inserting into RSVPD:', err);
          return res.status(500).send({ error: true, message: 'Database insertion failed' });
        }
        res.send({ error: false, message: 'RSVP added successfully', data: results });
      });
    });
  });
});

router.post("/removeRSVP", function (req, res, next) {
  // first get user ID, branch ID and org ID
  let userID = req.session.accountID;
  const { oppID } = req.body;

  let query = "DELETE FROM RSVPD WHERE userID = ? AND oppID = ?";
  connection.query(query, [userID, oppID], function (err, result) {
    if (err) {
      console.error('Error unjoining branch:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Successfully unRSVPD' });
  });
});

router.get('/checkRSVP', function (req, res, next) {
  console.log("checkrsvp");

  const oppID = req.query.id;
  const userID = req.session.accountID;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got error!!!!");
      res.sendStatus(500);
      return;
    }

    let query = `SELECT * FROM RSVPD WHERE userID = ? AND oppID = ?;`; // Adding a dummy condition to simplify appending AND conditions

    //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
    connection.query(query, [userID, oppID], function (err1, rows, fields) {
      // Close the connection
      connection.release();
      if (err1) {
        console.log("Error executing query:", err1);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows.length > 0) {
        // Results found
        res.json(true);
      } else {
        // No results found
        res.json(false);
      }
    });
  });
});

router.get('/checkOrg', function (req, res, next) {
  console.log("checkOrg");

  const branchID = req.query.id;
  const userID = req.session.accountID;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got error!!!!");
      res.sendStatus(500);
      return;
    }

    let query = `SELECT * FROM FollowedBranches WHERE userID = ? AND branchID = ?;`; // Adding a dummy condition to simplify appending AND conditions

    //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
    connection.query(query, [userID, branchID], function (err1, rows, fields) {
      if (err1) {
        console.log("Error executing query:", err1);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows.length > 0) {
        // Results found
        console.log("org found");
        res.json(true);
      } else {
        // No results found
        res.json(false);
      }
    });
  });
});

router.get('/findEmailName', function (req, res, next) {
  const query = 'SELECT o.oppName, u.email FROM RSVPD r JOIN Opportunities o ON r.oppID = o.oppID JOIN User u ON r.userID = u.userID WHERE r.userID = ? AND r.oppID = ?;';
  const userID = req.session.accountID;
  const oppID = req.query.id;
  connection.query(query, [userID, oppID], function (err1, rows, fields) {
    // Close the connection
    if (err1) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (rows.length === 0) {
      // No results found
      res.status(404).json({ error: "Opps not found" });
      return;
    }
    res.json(rows[0]);
  });
});

router.get('/showPosts', function (req, res, next) {
  console.log("I am here now!!!");

  const categories = req.query.categories;
  const commitment = req.query.commitment;
  const location = req.query.location;
  const branchID = req.query.branchID;
  let query = '';
  if (branchID === '-1' || branchID === undefined || branchID === "undefined" || branchID === "") {

    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.log("Got error!!!!");
        res.sendStatus(500);
        return;
      }
      console.log("IT IS UNDEFINED");
      query = `SELECT
                o.oppID,
                o.oppName,
                org.orgName,
                o.tags,
                o.description,
                o.thumbnail,
                org.orgSite
            FROM
                Opportunities o
            JOIN
                Organisations org ON b.orgID = org.orgID`

      const queryParams = [];

      if (categories) {
        if (queryParams.length === 0) {
          query += ' WHERE';
        } else {
          query += ' AND';
        }
        query += ' o.tags LIKE CONCAT(\'%\', ?, \'%\')';
        queryParams.push(categories);
      }

      if (commitment) {
        if (queryParams.length === 0) {
          query += ' WHERE';
        } else {
          query += ' AND';
        }
        query += ' o.commitment LIKE CONCAT(\'%\', ?, \'%\')';
        queryParams.push(commitment);
      }

      if (location) {
        if (queryParams.length === 0) {
          query += ' WHERE';
        } else {
          query += ' AND';
        }
        query += ' o.address LIKE CONCAT(\'%\', ?, \'%\')';
        queryParams.push(location);
      }

      query += ';';

      connection.query(query, queryParams, function (err1, rows, fields) {
        connection.release();
        console.log(query);
        if (err1) {
          console.log("Error executing query:", err1);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        if (rows.length === 0) {
          res.status(404).json({ error: "No opportunities found" });
          return;
        }
        console.log(rows);
        console.log("HELOOOOOOOOO")
        res.json(rows);
      });
    })
  } else {
    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.log("Got error!!!!");
        res.sendStatus(500);
        return;
      }
      console.log("Connected to pool");

      let query = `
          SELECT
              o.oppID,
              o.oppName,
              org.orgName,
              o.tags,
              o.description,
              o.thumbnail,
              org.orgSite
          FROM
              Opportunities o
          JOIN
              Branch b ON o.branchID = b.branchID
          JOIN
              Organisations org ON b.orgID = org.orgID`;

      const queryParams = [];

      if (branchID !== '-1' && branchID !== undefined && branchID !== "undefined" && branchID !== "") {
        query += ' WHERE b.branchID = ?';
        queryParams.push(branchID);
      }

      if (categories) {
        if (queryParams.length === 0) {
          query += ' WHERE';
        } else {
          query += ' AND';
        }
        query += ' o.tags LIKE CONCAT(\'%\', ?, \'%\')';
        queryParams.push(categories);
      }

      if (commitment) {
        if (queryParams.length === 0) {
          query += ' WHERE';
        } else {
          query += ' AND';
        }
        query += ' o.commitment LIKE CONCAT(\'%\', ?, \'%\')';
        queryParams.push(commitment);
      }

      if (location) {
        if (queryParams.length === 0) {
          query += ' WHERE';
        } else {
          query += ' AND';
        }
        query += ' o.address LIKE CONCAT(\'%\', ?, \'%\')';
        queryParams.push(location);
      }

      query += ';';

      connection.query(query, queryParams, function (err1, rows, fields) {
        connection.release();
        console.log(query);
        if (err1) {
          console.log("Error executing query:", err1);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        if (rows.length === 0) {
          res.status(404).json({ error: "No opportunities found" });
          return;
        }
        console.log(rows);
        console.log("HELOOOOOOOOO")
        res.json(rows);
      });
    });
  }
});


router.get('/findBranches', function (req, res, next) {
  var userID = req.session.accountID;
  //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
  var query = `SELECT
  b.branchName,
  b.branchID
  FROM
  Branch b
  JOIN
  Organisations org ON b.orgID = org.orgID
  WHERE
  org.orgID = ?
  AND b.instated = 1;`
  connection.query(query, userID, function (err1, rows, fields) {
    if (err1) {
      console.log("Error executing query:", err1);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (rows.length === 0) {
      // No results found
      res.status(404).json({ error: "Opps not found" });
      return;
    }

    // Results found, send back the details
    res.json(rows);
  });
});

router.get('/searchUsers', function (req, res, next) {
  const ID = req.query.id;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got error!!!!");
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool");
    //this is the query which i can change

    let query = `SELECT User.firstName, User.lastName, User.userID
    FROM User
    JOIN RSVPD ON User.userID = RSVPD.userID
    JOIN Opportunities ON RSVPD.oppID = Opportunities.oppID
    WHERE Opportunities.oppID = ?;`; // Adding a dummy condition to simplify appending AND conditions

    //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
    connection.query(query, [ID], function (err1, rows, fields) {
      // Close the connection
      console.log(query);
      connection.release();
      if (err1) {
        console.log("Error executing query:", err1);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows.length === 0) {
        // No results found
        res.status(404).json({ error: "Opp not found" });
        return;
      }
      res.json(rows);
    });
  });
});

router.post("/removeUserOrg", function (req, res, next) {
  // first get user ID, branch ID and org ID
  const { userID, oppID } = req.body;
  console.log(userID);
  console.log(oppID);
  let query = "DELETE FROM RSVPD WHERE userID = ? AND oppID = ?";
  connection.query(query, [userID, oppID], function (err, result) {
    console.log(query);
    if (err) {
      console.error('Error unjoining branch:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Successfully unRSVPD' });
  });
});

router.post('/createEvent', function (req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  // const { branchName, updateName, updateMsg, dateCreated } = req.body;
  const { oppName, tags, address, lat, long, commitment, suitability, training, requirements, thumbnail, description, dates, branchID, privacyValue } = req.body;
  // console.log("THE VALUES PARSED TO CREATE A NEW POST ARE " + branchName, orgID, updateName, updateMsg, dateCreated);
  //get the last created and used updateID

  var newPostQuery = "INSERT INTO Opportunities (oppName, tags, address, latitude, longitude, commitment, suitability, training, requirements, thumbnail, description, dates, branchID, private) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

  //using our connection apply the query to the database, we need the array [] to be the placeholder values of ? ? ? ? ?
  //err1 is the error, returnVal is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
  connection.query(newPostQuery, [oppName, tags, address, lat, long, commitment, suitability, training, requirements, thumbnail, description, dates, branchID, privacyValue], function (err2, returnVal) {

    //error handling
    if (err2) {
      //release the query, don't need access to the database anymore
      console.log("Got error while inserting new post: ", err2);
      res.sendStatus(500);
      return;
    }

    res.json({ message: 'Successfully Created Event' });
  });
});

router.get('/getAddress', function (req, res, next) {
  var branchID = req.body;
  //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
  var query = `SELECT
  address
  FROM
  Opportunities
  WHERE
  oppID = ?;`
  connection.query(query, oppID, function (err1, rows, fields) {
    if (err1) {
      console.log("Error executing query:", err1);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (rows.length === 0) {
      // No results found
      res.status(404).json({ error: "Addy not found" });
      return;
    }
    console.log(json(rows[0]));
    // Results found, send back the details
    res.json(rows[0]);
  });
});

router.post('/emailConfirmation', function (req, res, next) {
  //find the email list
  var userID = req.session.accountID;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  console.log("connected to pool");
  //this is the query which i can change
  var query = "SELECT email FROM User WHERE userID = ?;";
  //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
  connection.query(query, [userID], function (err1, rows, fields) {

    //close the door of the database, its like a bank vault, once we have opened it and got out the money (using the query) we close it
    if (err1) {
      console.log("Error executing query:", err1);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (rows.length > 0) {
      // Extract email addresses from the result rows
      const emailList = rows.map(row => row.email);
      // Organization found, send back the details
      let info = transporter.sendMail({
        from: "HeartFeltHelpersVolunteering@outlook.com", //sender address
        to: emailList.join(','), //list of recievers
        subject: req.body.subject, //subject line
        text: req.body.text, //plain text body
      })
    }
    return;
  });
});

router.post('/getCoords', function (req, res, next) {
  // search for it from the sql
  let oppID = req.body.oppID;
  console.log("WE ARE IN COORDINATES!")

  let query = "SELECT latitude, longitude FROM Opportunities WHERE oppID = ?"
  connection.query(query, [oppID], function (err, coords) {
    if (err) {
      console.log("Error executing query:", err1);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (coords.length > 0) {
      console.log("coords: ", coords[0]);
      res.json(coords[0]);
    } else {
      res.status(404).json({ error: "Coordinates not found" });
    }
  })
});

router.get('/allOpportunities', function (req, res, next) {
  if (req.session.userType === 'organisation') {
    let orgID = req.session.accountID;
    // only show posts you have made
    let query = `SELECT o.*
                FROM Opportunities o
                JOIN Branch b ON o.branchID = b.branchID
                JOIN Organisations org ON b.orgID = org.orgID
                WHERE org.orgID = ?;`;
    connection.query(query, [orgID], function (err, results) {
      if (err) {
        console.log("error in executing the queyr", err)
        res.status(500).json({ error: "internal server error" })
        return;
      }
      res.json(results);
    })
  } else if (req.session.userType === 'volunteer') {
    // show all posts regards
    // let query = 'SELECT * FROM Opportunities';
    let userID = req.session.accountID;
    let query = `SELECT o.*
                 FROM Opportunities o
                 JOIN Branch b ON o.branchID = b.branchID
                 LEFT JOIN FollowedBranches fb ON fb.branchID = b.branchID AND fb.userID = ?
                 WHERE o.private = 0 OR fb.userID IS NOT NULL;`;
    // only select if user id is
    connection.query(query, [userID], function (err, results) {
      if (err) {
        console.log("error in executing the queyr", err)
        res.status(500).json({ error: "internal server error" })
        return;
      }
      res.json(results);
    })
  } else {
    // show all posts regards
    let query = 'SELECT * FROM Opportunities WHERE private = 0;';
    // only select if user id is
    connection.query(query, function (err, results) {
      if (err) {
        console.log("error in executing the queyr", err)
        res.status(500).json({ error: "internal server error" })
        return;
      }
      res.json(results);
    })
  }
})




module.exports = router;