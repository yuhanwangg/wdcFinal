var express = require('express');
var bodyParser = require('body-parser');
var bodyParser = require('body-parser');
var router = express.Router();
router.use(bodyParser.json());
var adminIdCounter = 1;

var mysql = require('mysql');

var nodemailer = require('nodemailer')

var session = require('express-session');

var connection = mysql.createConnection({
  host: 'localhost',
  database: 'WDCProject'
});

connection.connect(function (err) {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});
router.use(bodyParser.json());


let transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  auth: {
    user: 'heartfelthelpers@outlook.com',
    pass: 'WDCProject'
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
      o.oppType,
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
  console.log("values in /addAdmin are" + first_name, last_name, email, password);

  //get the connection again
  req.pool.getConnection(function (err, connection) {
    //error handling
    if (err) {
      console.log("got error!!!!")
      res.sendStatus(500);
      return;
    }

    //get the last created and used AdminId
    var currAdminIdQuery = "SELECT adminId FROM Admin ORDER BY adminId DESC LIMIT 1;";

    connection.query(currAdminIdQuery, function (err1, result) {
      //release the query, don't need access to the database anymore

      //error handling
      if (err1) {
        connection.release();
        console.log("Got error while fetching AdminID: ", err1);
        res.sendStatus(500);
        return;
      }

      let currAdminId = 1;
      if (result.length > 0) {
        currAdminId = result[0].adminId + 1
      }
      console.log("the new admin id is " + currAdminId);

      var query = "INSERT INTO Admin (adminId, firstname, lastName, email, password) VALUES (?, ?, ?, ?, ?);";

      //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
      //err1 is the error, returnVal is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
      connection.query(query, [currAdminId, first_name, last_name, email, password], function (err2, returnVal) {
        //release the query, don't need access to the database anymore
        connection.release();
        //error handling
        if (err2) {
          console.log("Got error while inserting new admin: ", err2);
          res.sendStatus(500);
          return;
        }
        //send an empty response, not needing to return anything, or can send a message for clarity
        res.send("successfully added");
        return;
      });
    });
  });
});

router.get('/orgDetails', function (req, res, next) {
  console.log("i am here now!!!");

  const orgName = req.query.orgName;
  const email = req.query.email;
  console.log("the org name and email in /orgDetails is " + orgName + " " + email);
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got error!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool");
    //this is the query which i can change
    var query = "SELECT orgName, email, description, orgID FROM Organisations WHERE orgName = ? AND email = ?;";
    //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
    connection.query(query, [orgName, email], function (err1, rows, fields) {

      //close the door of the database, its like a bank vault, once we have opened it and got out the money (using the query) we close it
      connection.release();
      if (err1) {
        console.log("Error executing query:", err1);
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
});

router.get('/orgBranchRequests', function (req, res, next) {
  console.log("i am in the branch requests index.js!!!");
  const orgName = req.query.orgName;
  const email = req.query.email;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got connection error for org branch requests!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool in org branch requests");
    // First query to get the orgID
    var IDquery = "SELECT orgID FROM Organisations WHERE orgName = ? AND email = ?;";
    connection.query(IDquery, [orgName, email], function (err1, rows1) {

      if (err1) {
        connection.release();
        console.log("Error executing ID query:", err1);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows1.length === 0) {
        connection.release();
        // Organization not found
        res.status(404).json({ error: "Organization not found" });
        return;
      }

      const orgID = rows1[0].orgID;

      // Second query to get the branch requests using the orgID
      var branchRequestQuery = "SELECT branchName FROM Branch WHERE orgID = ? AND instated = 0";
      connection.query(branchRequestQuery, [orgID], function (err2, rows2) {
        connection.release();
        if (err2) {
          console.log("Error executing branch request query:", err2);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        // Branch requests found, send back the details
        res.json(rows2);
        return;
      });
    });
  });
});

router.get('/orgCurrentBranches', function (req, res, next) {
  console.log("i am in  current branch function now!!!");
  const orgName = req.query.orgName;
  const email = req.query.email;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got error in current branch!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool for current branch");
    // First query to get the orgID
    var IDquery = "SELECT orgID FROM Organisations WHERE orgName = ? AND email = ?;";
    connection.query(IDquery, [orgName, email], function (err1, rows1) {

      if (err1) {
        connection.release();
        console.log("Error executing ID query:", err1);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows1.length === 0) {
        connection.release();
        // Organization not found
        res.status(404).json({ error: "Organization not found" });
        return;
      }

      const orgID = rows1[0].orgID;

      // Second query to get the branch requests using the orgID
      var branchRequestQuery = "SELECT branchName FROM Branch WHERE orgID = ? AND instated = 1";
      connection.query(branchRequestQuery, [orgID], function (err2, rows2) {
        connection.release();
        if (err2) {
          console.log("Error executing branch current query:", err2);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        // Branch requests found, send back the details
        res.json(rows2);
        return;
      });
    });
  });
});

router.post('/instantiateBranch', function (req, res, next) {
  console.log("went into instantiateBranch");
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { branchName, orgName, orgEmail } = req.body;
  console.log(branchName, orgName, orgEmail);

  //get the connection again
  req.pool.getConnection(function (err, connection) {
    //error handling
    if (err) {
      console.log("got error!!!!")
      res.sendStatus(500);
      return;
    }
    // First query to get the orgID
    var IDquery = "SELECT orgID FROM Organisations WHERE orgName = ? AND email = ?;";
    connection.query(IDquery, [orgName, orgEmail], function (err1, rows1) {

      if (err1) {
        connection.release();
        console.log("Error executing ID query:", err1);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows1.length === 0) {
        connection.release();
        // Organization not found
        res.status(404).json({ error: "Organization not found" });
        return;
      }

      var orgID = rows1[0].orgID;

      // Second query to alter the branch instanitated value
      var updateInstanitatedQuery = "UPDATE Branch SET instated = 1 WHERE orgID = ? AND branchName = ?;";
      connection.query(updateInstanitatedQuery, [orgID, branchName], function (err2, rows2) {
        connection.release();
        if (err2) {
          console.log("Error executing branch current query:", err2);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        // Branch requests found, send back the details
        res.json(rows2);
        return;
      });
    });
  });
});


router.post('/removeBranch', function (req, res, next) {
  console.log("went into removeBranch");
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { branchName, orgName, orgEmail } = req.body;
  console.log(branchName, orgName, orgEmail);

  //get the connection again
  req.pool.getConnection(function (err, connection) {
    //error handling
    if (err) {
      console.log("got error!!!!")
      res.sendStatus(500);
      return;
    }
    // First query to get the orgID
    var IDquery = "SELECT orgID FROM Organisations WHERE orgName = ? AND email = ?;";
    connection.query(IDquery, [orgName, orgEmail], function (err1, rows1) {

      if (err1) {
        connection.release();
        console.log("Error executing ID query:", err1);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows1.length === 0) {
        connection.release();
        // Organization not found
        res.status(404).json({ error: "Organization not found" });
        return;
      }

      const orgID = rows1[0].orgID;

      // Second query to remove the branch and everything associated with it (ON DELETE CASCADE)
      var updateInstanitatedQuery = "DELETE FROM Branch WHERE orgID = ? AND branchName = ?;";
      connection.query(updateInstanitatedQuery, [orgID, branchName], function (err2, rows2) {
        connection.release();
        if (err2) {
          console.log("Error executing branch current query:", err2);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        // Branch requests found, send back the details
        res.json(rows2);
        return;
      });
    });
  });
});

router.post('/orgInfo', function (req, res, next) {
  // const orgId = req.query.param;

  // const {orgId} = req.body;
  const { orgName, orgEmail } = req.body;
  console.log("i am here now in orgInfo!!!");
  //console.log("i am here now in orgInfo!!! and the orgId is " + orgId);
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got error!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool");
    //this is the query which i can change
    // var query = "SELECT orgName, email, description FROM Organisations WHERE orgID = ?;";

    var query = "SELECT orgName, email, description FROM Organisations WHERE orgName = ? AND email = ? ;";
    //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
    // connection.query(query, [orgId], function(err1, rows, fields) {
    connection.query(query, [orgName, orgEmail], function (err1, rows, fields) {
      //close the door of the database, its like a bank vault, once we have opened it and got out the money (using the query) we close it
      connection.release();
      //error handling
      if (err1) {
        res.sendStatus(500);
        return;
      }
      //in this case we are recieving information from our query which we want to send back, so we send back a json version of the rows
      res.json(rows);
    });
  });
});

router.post('/orgId', function (req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name

  const { orgName, orgEmail } = req.body;
  console.log("the orgName and email in the index.js /orgId is " + orgName + " " + orgEmail);

  //get the connection again
  req.pool.getConnection(function (err, connection) {
    //error handling
    if (err) {
      console.log("got error!!!!")
      res.sendStatus(500);
      return;
    }
    // First query to get the orgID

    var query = "SELECT orgID FROM Organisations WHERE orgName = ? AND email = ? ;";

    connection.query(query, [orgName, orgEmail], function (err1, rows, fields) {
      console.log("the built query is: " + query);
      console.log("orgName value is: " + orgName);
      console.log("orgEmail value is: " + orgEmail);

      if (err1) {
        connection.release();
        console.log("Error executing ID query:", err1);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows.length === 0) {
        connection.release();
        // Organization not found
        console.log("I AM HERE!!");
        res.status(404).json({ error: "Organization not found" });
        return;
      }

      console.log("the found orgId in index.js is " + rows[0].orgID);
      res.json(rows);
    });
  });
});

router.post('/saveOrgInfoNewName', function (req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { orgId, newOrgName, newOrgEmail, newOrgDescription } = req.body;
  console.log("in saveOrgInfo index.js the values parsed are" + orgId + " " + newOrgName + " " + newOrgEmail + " " + newOrgDescription);

  if (orgId > 0) {
    //get the connection again
    req.pool.getConnection(function (err, connection) {
      //error handling
      if (err) {
        console.log("got error!!!!")
        res.sendStatus(500);
        return;
      }
      //changed query
      var query = "UPDATE Organisations SET orgName = ?, email = ?, description = ? WHERE orgID = ?;";

      //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
      //err1 is the error, rows is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
      connection.query(query, [newOrgName, newOrgEmail, newOrgDescription, orgId], function (err1, rows, fields) {
        //release the query, don't need access to the database anymore
        connection.release();
        //error handling
        if (err1) {
          res.sendStatus(500);
          return;
        }
        //send an empty response, not needing to return anything, or can send a message for clarity
        res.send("successfully updated");
      });
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
  console.log("in saveOrgInfoOldName index.js the values parsed are" + orgId + " " + newOrgName + " " + newOrgEmail + " " + newOrgDescription);

  if (orgId > 0) {
    //get the connection again
    req.pool.getConnection(function (err, connection) {
      //error handling
      if (err) {
        console.log("got error!!!!")
        res.sendStatus(500);
        return;
      }
      //changed query
      var query = "UPDATE Organisations SET email = ?, description = ? WHERE orgID = ?;";

      //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
      //err1 is the error, rows is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
      connection.query(query, [newOrgEmail, newOrgDescription, orgId], function (err1, rows, fields) {
        //release the query, don't need access to the database anymore
        connection.release();
        //error handling
        if (err1) {
          res.sendStatus(500);
          return;
        }
        //send an empty response, not needing to return anything, or can send a message for clarity
        res.send("successfully updated");
      });
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

  console.log("went into /deleteOrg and orgId = " + orgId);

  if (orgId > 0) {
    //get the connection again
    req.pool.getConnection(function (err, connection) {
      //error handling
      if (err) {
        console.log("got error!!!!")
        res.sendStatus(500);
        return;
      }
      else {
        console.log("didn't get error for connection");
      }
      //changed query
      var query = "DELETE FROM Organisations WHERE orgID = ?;";

      //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
      //err1 is the error, rows is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
      connection.query(query, [orgId], function (err1, rows, fields) {
        //release the query, don't need access to the database anymore
        connection.release();
        //error handling
        if (err1) {
          res.sendStatus(500);
          return;
        }
        //send an empty response, not needing to return anything, or can send a message for clarity
        res.send("successfully deleted");
      });
    });
  }
  else {
    res.status(404).json({ error: "Organization not found" });
    return
  }
});

router.get('/userDetails', function (req, res, next) {
  console.log("i am here now!!!");

  const firstName = req.query.userFirstName;
  const lastName = req.query.userLastName;
  const email = req.query.email;
  console.log("the first name, last name, and email in /userDetails is " + firstName + " " + lastName + " " + email);
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got error!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool");
    //this is the query which i can change
    var query = "SELECT userID, firstName, lastName, email FROM User WHERE firstName = ? AND lastName = ? AND email = ?;";
    //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
    connection.query(query, [firstName, lastName, email], function (err1, rows, fields) {

      //close the door of the database, its like a bank vault, once we have opened it and got out the money (using the query) we close it
      connection.release();
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
});

router.post('/userInfo', function (req, res, next) {

  const { userID } = req.body;
  console.log("i am here now in userInfo!!!");

  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got error!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool");
    //this is the query which i can change

    var query = "SELECT firstName, lastName, email FROM User WHERE userID = ? ;";
    //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields

    connection.query(query, [userID], function (err1, rows, fields) {
      //close the door of the database, its like a bank vault, once we have opened it and got out the money (using the query) we close it
      connection.release();
      //error handling
      if (err1) {
        res.sendStatus(500);
        return;
      }
      //in this case we are recieving information from our query which we want to send back, so we send back a json version of the rows
      res.json(rows);
    });
  });
});


router.post('/saveUserInfo', function (req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { userID, newFirstName, newLastName, newEmail } = req.body;

  if (userID > 0) {
    req.pool.getConnection(function (err, connection) {
      //error handling
      if (err) {
        console.log("got error!!!!")
        res.sendStatus(500);
        return;
      }
      //changed query
      var query = "UPDATE User SET firstName = ?, lastName = ?, email = ? WHERE userID = ?;";

      //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
      //err1 is the error, rows is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
      connection.query(query, [newFirstName, newLastName, newEmail, userID], function (err1, rows, fields) {
        //release the query, don't need access to the database anymore
        connection.release();
        //error handling
        if (err1) {
          res.sendStatus(500);
          return;
        }
        //send an empty response, not needing to return anything, or can send a message for clarity
        res.send("successfully updated");
      });
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

  console.log("went into /deleteUser and userID = " + userID);

  if (userID > 0) {
    //get the connection again
    req.pool.getConnection(function (err, connection) {
      //error handling
      if (err) {
        console.log("got error!!!!")
        res.sendStatus(500);
        return;
      }
      else {
        console.log("didn't get error for connection");
      }
      //changed query
      var query = "DELETE FROM User WHERE userID = ?;";

      //using our connection apply the query to the database, we need the array [first_name, last_name] to be the placeholder values of ? ?
      //err1 is the error, rows is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
      connection.query(query, [userID], function (err1, rows, fields) {
        //release the query, don't need access to the database anymore
        connection.release();
        //error handling
        if (err1) {
          res.sendStatus(500);
          return;
        }
        //send an empty response, not needing to return anything, or can send a message for clarity
        res.send("successfully deleted");
      });
    });
  }
  else {
    res.status(404).json({ error: "User not found" });
    return
  }
});


router.get('/oldPosts', function (req, res, next) {
  console.log("i am in the oldPosts requests index.js!!!");
  const branchID = req.query.branchID;
  //const branchName = req.query.branch;
  const orgID = req.query.orgID;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got connection error for org branch requests!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool in org branch requests");

    // query to get the update posts by the branch
    var oldPostsQuery = "SELECT * FROM Updates WHERE branchID = ?";
    connection.query(oldPostsQuery, [branchID], function (err2, rows2) {
      connection.release();
      if (err2) {
        console.log("Error executing branch request query:", err2);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // old update posts found, send back the details
      res.json(rows2);
      return;
    });
  });
});

router.get('/getBranches', function (req, res, next) {
  console.log("i am in the getBranches requests index.js!!!");
  const orgID = req.query.orgID;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got connection error for org branch requests!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool in org branch requests");
    // First query to get the orgID
    var query = "SELECT * FROM Branch WHERE orgID = ? && instated = 1;";
    connection.query(query, [orgID], function (err1, rows1) {

      if (err1) {
        connection.release();
        console.log("Error executing ID query:", err1);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows1.length === 0) {
        connection.release();
        // Organization not found
        res.status(404).json({ error: "Organization not found" });
        return;
      }

      res.json(rows1);
      return;
    });
  });
});


router.get('/getOrgName', function (req, res, next) {
  console.log("i am in the getOrgName requests index.js!!!");
  const orgID = req.query.orgID;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got connection error for org branch requests!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool in org branch requests");
    // First query to get the orgID
    var query = "SELECT orgName FROM Organisations WHERE orgID = ?;";
    connection.query(query, [orgID], function (err1, rows1) {

      if (err1) {
        connection.release();
        console.log("Error executing ID query:", err1);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows1.length === 0) {
        connection.release();
        // Organization not found
        res.status(404).json({ error: "Organization not found" });
        return;
      }

      res.json(rows1[0]);
      return;
    });
  });
});

router.get('/getOrgLogo', function (req, res, next) {
  console.log("i am in the getOrgLogo requests index.js!!!");
  const orgID = req.query.orgID;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got connection error for org branch requests!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool in org branch requests");
    // First query to get the orgID
    var query = "SELECT imgPath FROM Organisations WHERE orgID = ?;";
    connection.query(query, [orgID], function (err1, rows1) {

      if (err1) {
        connection.release();
        console.log("Error executing ID query:", err1);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows1.length === 0) {
        connection.release();
        // Organization not found
        res.status(404).json({ error: "Organization not found" });
        return;
      }

      res.json(rows1[0]);
      return;
    });
  });
});


router.post('/createNewPost', function (req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  // const { branchName, orgID, updateName, updateMsg, dateCreated } = req.body;
  const { branchID, orgID, updateName, updateMsg, dateCreated } = req.body;
  // console.log("THE VALUES PARSED TO CREATE A NEW POST ARE " + branchName, orgID, updateName, updateMsg, dateCreated);
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got connection error for org branch requests!!!!")
      res.sendStatus(500);
      return;
    }
    //get the last created and used updateID
    var currUpdateIdQuery = "SELECT updateID FROM Updates ORDER BY updateID DESC LIMIT 1;";

    connection.query(currUpdateIdQuery, function (err1, result) {
      //release the query, don't need access to the database anymore

      //error handling
      if (err1) {
        connection.release();
        console.log("Got error while fetching updateID: ", err1);
        res.sendStatus(500);
        return;
      }

      let currUpdateId = 1;
      if (result.length > 0) {
        currUpdateId = result[0].updateID + 1
      }
      console.log("the new update id is " + currUpdateId);

      var newPostQuery = "INSERT INTO Updates (updateID, updateName, updateMsg, branchID, dateCreated) VALUES (?, ?, ?, ?, ?);";

      //using our connection apply the query to the database, we need the array [] to be the placeholder values of ? ? ? ? ?
      //err1 is the error, returnVal is the result (we can change this to be any variable, it will probalby return an empty list or soemthing from the query), don't need fields
      connection.query(newPostQuery, [currUpdateId, updateName, updateMsg, branchID, dateCreated], function (err2, returnVal) {

        //error handling
        if (err2) {
          //release the query, don't need access to the database anymore
          connection.release();
          console.log("Got error while inserting new post: ", err2);
          res.sendStatus(500);
          return;
        }

        var allPosts = "SELECT * FROM Updates WHERE branchID = ?";
        connection.query(allPosts, [branchID], function (err2, rows2) {
          connection.release();
          if (err2) {
            console.log("Error executing branch request query:", err2);
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
});

router.post('/email', function (req, res, next) {
  let info = transporter.sendMail({
    from: "heartfelthelpers@outlook.com", //sender address
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
  req.pool.getConnection(function (err, connection) {
    //this is the error handling
    if (err) {
      console.log("got error!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool");
    //this is the query which i can change
    var query = "SELECT email FROM User WHERE userID IN (SELECT userID FROM FollowedBranches WHERE branchID = ? AND emailSubscribed = 1);";
    //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
    connection.query(query, [req.body.branchID], function (err1, rows, fields) {

      //close the door of the database, its like a bank vault, once we have opened it and got out the money (using the query) we close it
      connection.release();
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
          from: "heartfelthelpers@outlook.com", //sender address
          to: emailList.join(','), //list of recievers
          subject: req.body.subject, //subject line
          text: req.body.text, //plain text body
          html: req.body.text //html body
        })
      }
      return;
    });
  });
});

//ROUTES LUCY
// sign up user ALSO update session tokens
router.post('/addUser', function (req, res, next) {

  const { first_name, last_name, dob, suburb, state, postcode, country, email, password } = req.body;
  console.log("Received data ", first_name, last_name, dob, suburb, state, postcode, country, email, password);

  //get connection
  req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      console.log("error")
      res.sendStatus(500);
      return;
    }

    // check if email already present in user database
    var checkPresent = "SELECT email FROM User WHERE email = ?;";
    connection.query(checkPresent, [email], function (err1, result1) {
      if (err1) {
        connection.release();
        console.log("Error checking for email: ", err1);
        res.sendStatus(500);
        return;
      }

      //email exists
      if (result1.length > 0) {
        connection.release();
        console.log("email in use");
        res.status(400).send("email in use");
        return;
      }
      // });

      // check if email already present in org database
      checkPresent = "SELECT email FROM Organisations WHERE email = ?;";
      connection.query(checkPresent, [email], function (err2, result2) {
        if (err2) {
          connection.release();
          console.log("Error checking for email: ", err2);
          res.sendStatus(500);
          return;
        }

        //email exists
        if (result2.length > 0) {
          connection.release();
          console.log("email in use");
          res.status(400).send("email in use");
          return;
        }
        // });

        // check if email already present in admin database
        var checkPresent = "SELECT email FROM Admin WHERE email = ?;";
        connection.query(checkPresent, [email], function (err3, result3) {
          if (err3) {
            connection.release();
            console.log("Error checking for email: ", err3);
            res.sendStatus(500);
            return;
          }

          //email exists
          if (result3.length > 0) {
            connection.release();
            console.log("email in use");
            res.status(400).send("email in use");
            return;
          }
          // });

          //get last user id
          var mostRecentUserId = "SELECT userID FROM User ORDER BY userID DESC LIMIT 1;";

          connection.query(mostRecentUserId, function (err4, result) {

            //error handling
            if (err4) {
              connection.release();
              console.log("Got error while fetching userID: ", err4);
              res.sendStatus(500);
              return;
            }

            let currUserId = 1;
            if (result.length > 0) {
              currUserId = result[0].userID + 1;
            }
            console.log("the new user id is " + currUserId);

            var query = "INSERT INTO User (userID, firstName, lastName, DOB, suburb, state, postcode, country, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

            connection.query(query, [currUserId, first_name, last_name, dob, suburb, state, postcode, country, email, password], function (err5, returnVal) {
              connection.release();

              if (err5) {
                console.log("error inserting user", err5);
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
  console.log("Received data ", name, email, password, suburb, state, postcode, country);

  //get connection
  req.pool.getConnection(function (err, connection) {
    //error handling
    if (err) {
      console.log("error")
      res.sendStatus(500);
      return;
    }

    // check if email already present in user database
    var checkPresent = "SELECT email FROM User WHERE email = ?;";
    connection.query(checkPresent, [email], function (err1, result1) {
      if (err1) {
        connection.release();
        console.log("Error checking for email: ", err1);
        res.sendStatus(500);
        return;
      }

      //email exists
      if (result1.length > 0) {
        connection.release();
        console.log("email in use");
        res.status(400).send("email in use");
        return;
      }
      //  });

      // check if email already present in org database
      checkPresent = "SELECT email FROM Organisations WHERE email = ?;";
      connection.query(checkPresent, [email], function (err2, result2) {
        if (err2) {
          connection.release();
          console.log("Error checking for email: ", err2);
          res.sendStatus(500);
          return;
        }

        //email exists
        if (result2.length > 0) {
          connection.release();
          console.log("email in use");
          res.status(400).send("email in use");
          return;
        }
        // });

        // check if email already present in admin database
        var checkPresent = "SELECT email FROM Admin WHERE email = ?;";
        connection.query(checkPresent, [email], function (err3, result3) {
          if (err3) {
            connection.release();
            console.log("Error checking for email: ", err3);
            res.sendStatus(500);
            return;
          }

          //email exists
          if (result3.length > 0) {
            connection.release();
            console.log("email in use");
            res.status(400).send("email in use");
            return;
          }
          // });

          //get last org id
          var mostRecentOrgId = "SELECT orgID FROM Organisations ORDER BY orgID DESC LIMIT 1;";

          connection.query(mostRecentOrgId, function (err4, result4) {

            //error handling
            if (err4) {
              connection.release();
              console.log("Got error while fetching orgID: ", err4);
              res.sendStatus(500);
              return;
            }

            let currOrgId = 1;
            if (result4.length > 0) {
              currOrgId = result4[0].orgID + 1;
            }
            console.log("the new org id is " + currOrgId);

            //get last branch id
            var mostRecentBranchId = "SELECT branchID FROM Branch ORDER BY branchID DESC LIMIT 1;";

            connection.query(mostRecentBranchId, function (err5, result5) {

              //error handling
              if (err5) {
                connection.release();
                console.log("Got error while fetching branchID: ", err5);
                res.sendStatus(500);
                return;
              }

              let currBranchId = 1;
              if (result5.length > 0) {
                currBranchId = result5[0].branchID + 1;
              }
              console.log("the new branch id is " + currBranchId);

              var query = "INSERT INTO Organisations (orgID, orgName, email, password) VALUES (?, ?, ?, ?);";

              connection.query(query, [currOrgId, name, email, password], function (err6, returnVal) {
                // connection.release();

                if (err6) {
                  connection.release();
                  console.log("error inserting org", err6);
                  res.sendStatus(500);
                  return;
                }
                //send an empty response, not needing to return anything, or can send a message for clarity
                // res.send("organisation successfully added");
                // return;

              });

              var queryBranch = "INSERT INTO Branch (orgID, branchName, branchID, suburb, state, postcode, country) VALUES (?, ?, ?, ?, ?, ?, ?);";

              connection.query(queryBranch, [currOrgId, name, currBranchId, suburb, state, postcode, country], function (err7, returnVal) {
                connection.release();

                if (err7) {
                  console.log("error inserting branch", err7);
                  res.sendStatus(500);
                  return;
                }

                req.session.user = email;
                req.session.userType = "organisation";
                req.session.accountID = currOrgId;
                console.log(req.session.user, req.session.userType, req.session.accountID);

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

//login
router.post('/login', function (req, res, next) {

  const { email, password } = req.body;
  console.log("Received data ", email, password);

  //set session user to email
  req.session.user = req.body.email;

  //get connection
  req.pool.getConnection(function (err, connection) {
    //error handling
    if (err) {
      console.log("error")
      res.sendStatus(500);
      return;
    }

    var accountQuery = "SELECT userID FROM User WHERE email = ? AND password = ?;";
    connection.query(accountQuery, [email, password], function (err, rows) {
      if (err) {
        connection.release();
        console.log("Error finding login", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows.length > 0) {
        connection.release();
        const id = rows[0].userID;
        req.session.userType = "volunteer";
        req.session.accountID = id;
        console.log("User id:", id);
        console.log(req.session.userType, req.session.user);
        res.status(200).json({ userType: 'volunteer' });
        return;
      } else {
        var orgQuery = "SELECT orgID FROM Organisations WHERE email = ? AND password = ?;";
        connection.query(orgQuery, [email, password], function (err, rows) {
          if (err) {
            connection.release();
            console.log("Error finding login", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }

          if (rows.length > 0) {
            connection.release();
            const id = rows[0].orgID;
            console.log("Org id:", id);
            req.session.userType = "organisation";
            req.session.accountID = id;
            console.log(req.session.userType, req.session.user);
            res.status(200).json({ userType: 'organisation' });
            return;
          } else {
            var adminQuery = "SELECT adminID FROM Admin WHERE email = ? AND password = ?;";
            connection.query(adminQuery, [email, password], function (err, rows) {
              connection.release();
              if (err) {
                console.log("Error finding login", err);
                res.status(500).json({ error: "Internal Server Error" });
                return;
              }

              if (rows.length > 0) {
                const id = rows[0].adminID;
                console.log("Admin id:", id);
                req.session.accountID = id;
                req.session.userType = "admin";
                console.log(req.session.userType, req.session.user);
                res.status(200).json({ userType: 'admin' });
                return;
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
  console.log(email);

  //get connection
  req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      console.log("error")
      res.sendStatus(500);
      return;
    }

    // check if email already present in user database
    var checkPresent = "SELECT email FROM User WHERE email = ?;";
    connection.query(checkPresent, [email], function (err1, result1) {
      if (err1) {
        connection.release();
        console.log("Error checking for email: ", err1);
        res.sendStatus(500);
        return;
      }

      //email exists
      if (result1.length > 0) {
        connection.release();
        console.log("email in use");
        res.status(400).send("email in use");
        return;
      }
      // });

      // check if email already present in org database
      checkPresent = "SELECT email FROM Organisations WHERE email = ?;";
      connection.query(checkPresent, [email], function (err2, result2) {
        if (err2) {
          connection.release();
          console.log("Error checking for email: ", err2);
          res.sendStatus(500);
          return;
        }

        //email exists
        if (result2.length > 0) {
          connection.release();
          console.log("email in use");
          res.status(400).send("email in use");
          return;
        }
        // });

        // check if email already present in admin database
        var checkPresent = "SELECT email FROM Admin WHERE email = ?;";
        connection.query(checkPresent, [email], function (err3, result3) {
          if (err3) {
            connection.release();
            console.log("Error checking for email: ", err3);
            res.sendStatus(500);
            return;
          }

          //email exists
          if (result3.length > 0) {
            connection.release();
            console.log("email in use");
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
  console.log(password);
  var accountID = req.session.accountID;

  //get connection
  req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      console.log("error")
      res.sendStatus(500);
      return;
    }

    //check if password matches
    var accountQuery = "SELECT userID FROM User WHERE userID = ? AND password = ?;";
    await connection.query(accountQuery, [accountID, password], async function (err, rows) {

      if (err) {
        //connection.release();
        console.log("Error finding login", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows.length > 0) {
        //all good
        res.send();
      } else {
        connection.release();
        console.log("password incorrect !!");
        res.status(400).send("password incorrect");
        return;
      }

    });

  });

});

//check password matches in org
router.post('/checkPasswordOrg', function (req, res, next) {
  const { password } = req.body;
  console.log(password, accountID);
  var accountID = req.session.accountID;

  //get connection
  req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      console.log("error")
      res.sendStatus(500);
      return;
    }

    //check if password matches
    var accountQuery = "SELECT orgID FROM Organisations WHERE orgID = ? AND password = ?;";
    await connection.query(accountQuery, [accountID, password], async function (err, rows) {

      if (err) {
        //connection.release();
        console.log("Error finding login", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows.length > 0) {
        //all good
        res.send();
      } else {
        connection.release();
        console.log("password incorrect !!");
        res.status(400).send("password incorrect");
        return;
      }

    });

  });

});

//check password matches in admin
router.post('/checkPasswordAdmin', function (req, res, next) {
  const { password } = req.body;
  console.log(password, accountID);
  var accountID = req.session.accountID;

  //get connection
  req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      console.log("error")
      res.sendStatus(500);
      return;
    }

    //check if password matches
    var accountQuery = "SELECT adminID FROM Admin WHERE adminID = ? AND password = ?;";
    await connection.query(accountQuery, [accountID, password], async function (err, rows) {

      if (err) {
        //connection.release();
        console.log("Error finding login", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (rows.length > 0) {
        //all good
        res.send();
      } else {
        connection.release();
        console.log("password incorrect !!");
        res.status(400).send("password incorrect");
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

  console.log(req.session.user, req.session.userType, accountID, email);

  await req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      console.log("error")
      res.sendStatus(500);
      return;
    }

    if (updateEmail == 1) {
      const query = 'UPDATE User SET email = ? WHERE email = ?;';

      connection.query(query, [email, currentEmail], function (err, returnVal) {
        //connection.release();

        if (err) {
          console.log("error inserting new email", err);
          res.sendStatus(500);
          return;
        }
        console.log("email updated")
      });
    }

    if (updateName == 1) {
      const query = 'UPDATE User SET firstName = ?, lastName = ? WHERE userID = ?;';

      await connection.query(query, [firstName, lastName, accountID], function (err, returnVal) {
        //connection.release();

        if (err) {
          console.log("error inserting new name", err);
          res.sendStatus(500);
          return;
        }
        console.log("name updated");
      });

    }

    if (updatePassword == 1) {
      //update password
      const query = 'UPDATE User SET password = ? WHERE userID = ?;';

      await connection.query(query, [newPassword, accountID], function (err, returnVal) {
        // connection.release();
        if (err) {
          console.log("error inserting new password", err);
          res.sendStatus(500);
          return;
        }

        console.log("password updated");
      });
      // });

    }

    if (updateLocation == 1) {
      const query = 'UPDATE User SET suburb = ?, state = ?, postcode = ?, country = ? WHERE userID = ?;';

      await connection.query(query, [suburb, state, postcode, country, accountID], function (err, returnVal) {
        //connection.release();

        if (err) {
          console.log("error inserting new location", err);
          res.sendStatus(500);
          return;
        }
        console.log("location updated");
      });

    }

    console.log("got to the end");
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
    console.log("session type: ", req.session.userType);
    res.json({ userType: req.session.userType });
  } else if (req.session.userType == null) {
    res.json({})
  } else {
    res.status(404).json({ error: "cant find sess type" });
  }
});


router.get('/getName', function (req, res) {
  if (req.session.userType) {
    console.log("session type: ", req.session.userType);
    console.log("user ID: ", req.session.accountID);

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
  console.log("Received data ", email, password);

  accountID = req.session.accountID;

  //get connection
  req.pool.getConnection(function (err, connection) {
    //error handling
    if (err) {
      console.log("error")
      res.sendStatus(500);
      return;
    }

    //check if the email and password match the database and the id of the user who is currently logged in
    var accountQuery = "SELECT userID FROM User WHERE email = ? AND password = ? AND userID = ?;";
    connection.query(accountQuery, [email, password, accountID], function (err, rows) {
      if (err) {
        connection.release();
        console.log("Error matching details", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      //matches
      if (rows.length > 0) {

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
        //does not match
      } else {
        connection.release();
        console.log("account details incorrect !!");
        res.status(400).send("account details incorrect");
      }
    });
  });
});

//update org info
router.post('/updateOrgInfo', async function (req, res, next) {
  const { email, name, url, oldPassword, newPassword, updateEmail, updateName, updatePassword, updateURL } = req.body;
  const currentEmail = req.session.user;
  const accountID = req.session.accountID;

  console.log(req.session.user, req.session.userType, accountID, email);

  await req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      console.log("error")
      res.sendStatus(500);
      return;
    }

    if (updateEmail == 1) {
      const query = 'UPDATE Organisations SET email = ? WHERE email = ?;';

      connection.query(query, [email, currentEmail], function (err, returnVal) {
        //connection.release();

        if (err) {
          console.log("error inserting new email", err);
          res.sendStatus(500);
          return;
        }
        console.log("email updated")
      });
    }

    if (updateName == 1) {
      const query = 'UPDATE Organisations SET orgName = ? WHERE orgID = ?;';

      await connection.query(query, [name, accountID], function (err, returnVal) {
        //connection.release();

        if (err) {
          console.log("error inserting new name", err);
          res.sendStatus(500);
          return;
        }
        console.log("name updated");
      });

    }

    if (updateURL == 1) {
      const query = 'UPDATE Organisations SET orgSite = ? WHERE orgID = ?;';

      await connection.query(query, [url, accountID], function (err, returnVal) {
        //connection.release();

        if (err) {
          console.log("error inserting new url", err);
          res.sendStatus(500);
          return;
        }
        console.log("url updated");
      });

    }

    if (updatePassword == 1) {
      //update password
      const query = 'UPDATE Organisations SET password = ? WHERE orgID = ?;';

      await connection.query(query, [newPassword, accountID], function (err, returnVal) {
        // connection.release();
        if (err) {
          console.log("error inserting new password", err);
          res.sendStatus(500);
          return;
        }

        console.log("password updated");
      });
      // });

    }

    console.log("got to the end");
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
  console.log("Received data ", email, password);

  accountID = req.session.accountID;

  //get connection
  req.pool.getConnection(function (err, connection) {
    //error handling
    if (err) {
      console.log("error")
      res.sendStatus(500);
      return;
    }

    //check if the email and password match the database and the id of the user who is currently logged in
    var accountQuery = "SELECT orgID FROM Organisations WHERE email = ? AND password = ? AND orgID = ?;";
    connection.query(accountQuery, [email, password, accountID], function (err, rows) {
      if (err) {
        connection.release();
        console.log("Error matching details", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      //matches
      if (rows.length > 0) {

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
        //does not match
      } else {
        connection.release();
        console.log("account details incorrect !!");
        res.status(400).send("account details incorrect");
      }
    });
  });
});

//update admin info
router.post('/updateAdminInfo', async function (req, res, next) {
  const { email, firstName, lastName, oldPassword, newPassword, updateEmail, updateName, updatePassword } = req.body;
  const currentEmail = req.session.user;
  const accountID = req.session.accountID;

  console.log(req.session.user, req.session.userType, accountID, email);

  await req.pool.getConnection(async function (err, connection) {
    //error handling
    if (err) {
      console.log("error")
      res.sendStatus(500);
      return;
    }

    if (updateEmail == 1) {
      const query = 'UPDATE Admin SET email = ? WHERE email = ?;';

      connection.query(query, [email, currentEmail], function (err, returnVal) {
        //connection.release();

        if (err) {
          console.log("error inserting new email", err);
          res.sendStatus(500);
          return;
        }
        console.log("email updated")
      });
    }

    if (updateName == 1) {
      const query = 'UPDATE Admin SET firstName = ?, lastName = ? WHERE adminID = ?;';

      await connection.query(query, [firstName, lastName, accountID], function (err, returnVal) {
        //connection.release();

        if (err) {
          console.log("error inserting new name", err);
          res.sendStatus(500);
          return;
        }
        console.log("name updated");
      });

    }

    if (updatePassword == 1) {
      //update password
      const query = 'UPDATE Admin SET password = ? WHERE adminID = ?;';

      await connection.query(query, [newPassword, accountID], function (err, returnVal) {
        // connection.release();
        if (err) {
          console.log("error inserting new password", err);
          res.sendStatus(500);
          return;
        }

        console.log("password updated");
      });
      // });

    }

    console.log("got to the end");
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
  console.log("Received data ", email, password);

  accountID = req.session.accountID;

  //get connection
  req.pool.getConnection(function (err, connection) {
    //error handling
    if (err) {
      console.log("error")
      res.sendStatus(500);
      return;
    }

    //check if the email and password match the database and the id of the user who is currently logged in
    var accountQuery = "SELECT adminID FROM Admin WHERE email = ? AND password = ? AND adminID = ?;";
    connection.query(accountQuery, [email, password, accountID], function (err, rows) {
      if (err) {
        connection.release();
        console.log("Error matching details", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      //matches
      if (rows.length > 0) {

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
        //does not match
      } else {
        connection.release();
        console.log("account details incorrect !!");
        res.status(400).send("account details incorrect");
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
}
);

module.exports = router;