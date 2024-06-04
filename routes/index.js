var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
router.use(bodyParser.json());

var nodemailer = require('nodemailer')

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
  res.render('homeGuest', { title: 'Express' });
});


router.post('/addAdmin',function(req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { first_name, last_name, email, password } = req.body;
  console.log("values in /addAdmin are" + first_name, last_name, email, password);

  //get the connection again
  req.pool.getConnection(function(err,connection) {
    //error handling
    if (err) {
      console.log("got error!!!!")
      res.sendStatus(500);
      return;
    }

    //get the last created and used AdminId
    var currAdminIdQuery = "SELECT adminId FROM Admin ORDER BY adminId DESC LIMIT 1;";

    connection.query(currAdminIdQuery, function(err1, result) {
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
      connection.query(query, [currAdminId, first_name,last_name, email, password], function(err2, returnVal) {
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

router.get('/orgDetails', function(req, res, next) {
  console.log("i am here now!!!");

  const orgName = req.query.orgName;
  const email = req.query.email;
  console.log("the org name and email in /orgDetails is " + orgName +  " " + email);
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function(err,connection) {
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
    connection.query(query, [orgName,email], function(err1, rows, fields) {

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

router.get('/orgBranchRequests', function(req, res, next) {
  console.log("i am in the branch requests index.js!!!");
  const orgName = req.query.orgName;
  const email = req.query.email;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function(err,connection) {
    //this is the error handling
    if (err) {
      console.log("got connection error for org branch requests!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool in org branch requests");
    // First query to get the orgID
    var IDquery = "SELECT orgID FROM Organisations WHERE orgName = ? AND email = ?;";
    connection.query(IDquery, [orgName, email], function(err1, rows1) {

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
      connection.query(branchRequestQuery, [orgID], function(err2, rows2) {
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

router.get('/orgCurrentBranches', function(req, res, next) {
  console.log("i am in  current branch function now!!!");
  const orgName = req.query.orgName;
  const email = req.query.email;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function(err,connection) {
    //this is the error handling
    if (err) {
      console.log("got error in current branch!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool for current branch");
    // First query to get the orgID
    var IDquery = "SELECT orgID FROM Organisations WHERE orgName = ? AND email = ?;";
    connection.query(IDquery, [orgName, email], function(err1, rows1) {

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
      connection.query(branchRequestQuery, [orgID], function(err2, rows2) {
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

router.post('/instantiateBranch',function(req, res, next) {
  console.log("went into instantiateBranch");
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { branchName, orgName, orgEmail } = req.body;
  console.log(branchName, orgName, orgEmail);

  //get the connection again
  req.pool.getConnection(function(err,connection) {
    //error handling
    if (err) {
      console.log("got error!!!!")
      res.sendStatus(500);
      return;
    }
    // First query to get the orgID
    var IDquery = "SELECT orgID FROM Organisations WHERE orgName = ? AND email = ?;";
    connection.query(IDquery, [orgName, orgEmail], function(err1, rows1) {

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
      connection.query(updateInstanitatedQuery, [orgID, branchName], function(err2, rows2) {
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


router.post('/removeBranch',function(req, res, next) {
  console.log("went into removeBranch");
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { branchName, orgName, orgEmail } = req.body;
  console.log(branchName, orgName, orgEmail);

  //get the connection again
  req.pool.getConnection(function(err,connection) {
    //error handling
    if (err) {
      console.log("got error!!!!")
      res.sendStatus(500);
      return;
    }
    // First query to get the orgID
    var IDquery = "SELECT orgID FROM Organisations WHERE orgName = ? AND email = ?;";
    connection.query(IDquery, [orgName, orgEmail], function(err1, rows1) {

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
      connection.query(updateInstanitatedQuery, [orgID, branchName], function(err2, rows2) {
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

router.post('/orgInfo', function(req, res, next) {
  // const orgId = req.query.param;

  // const {orgId} = req.body;
  const { orgName, orgEmail } = req.body;
  console.log("i am here now in orgInfo!!!");
  //console.log("i am here now in orgInfo!!! and the orgId is " + orgId);
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function(err,connection) {
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
    connection.query(query, [orgName, orgEmail], function(err1, rows, fields) {
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

router.post('/orgId',function(req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name

  const { orgName, orgEmail } = req.body;
  console.log("the orgName and email in the index.js /orgId is " + orgName + " " + orgEmail);

  //get the connection again
  req.pool.getConnection(function(err,connection) {
    //error handling
    if (err) {
      console.log("got error!!!!")
      res.sendStatus(500);
      return;
    }
    // First query to get the orgID

    var query = "SELECT orgID FROM Organisations WHERE orgName = ? AND email = ? ;";

    connection.query(query, [orgName, orgEmail], function(err1, rows, fields) {
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

router.post('/saveOrgInfoNewName',function(req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { orgId, newOrgName, newOrgEmail, newOrgDescription} = req.body;
  console.log("in saveOrgInfo index.js the values parsed are" + orgId + " " + newOrgName + " " + newOrgEmail + " " + newOrgDescription);

  if (orgId > 0) {
    //get the connection again
    req.pool.getConnection(function(err,connection) {
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
      connection.query(query, [newOrgName, newOrgEmail, newOrgDescription, orgId], function(err1, rows, fields) {
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


router.post('/saveOrgInfoOldName',function(req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { orgId, newOrgName, newOrgEmail, newOrgDescription} = req.body;
  console.log("in saveOrgInfoOldName index.js the values parsed are" + orgId + " " + newOrgName + " " + newOrgEmail + " " + newOrgDescription);

  if (orgId > 0) {
    //get the connection again
    req.pool.getConnection(function(err,connection) {
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
      connection.query(query, [newOrgEmail, newOrgDescription, orgId], function(err1, rows, fields) {
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

router.post('/deleteOrg',function(req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { orgId } = req.body;

  console.log("went into /deleteOrg and orgId = " + orgId);

  if (orgId > 0) {
    //get the connection again
    req.pool.getConnection(function(err,connection) {
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
      connection.query(query, [orgId], function(err1, rows, fields) {
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

router.get('/userDetails', function(req, res, next) {
  console.log("i am here now!!!");

  const firstName = req.query.userFirstName;
  const lastName = req.query.userLastName;
  const email = req.query.email;
  console.log("the first name, last name, and email in /userDetails is " + firstName +  " " + lastName + " " +  email);
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function(err,connection) {
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
    connection.query(query, [firstName,lastName,email], function(err1, rows, fields) {

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

router.post('/userInfo', function(req, res, next) {

  const { userID } = req.body;
  console.log("i am here now in userInfo!!!");

  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function(err,connection) {
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

    connection.query(query, [userID], function(err1, rows, fields) {
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


router.post('/saveUserInfo',function(req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { userID, newFirstName, newLastName, newEmail} = req.body;

  if (userID > 0) {
    req.pool.getConnection(function(err,connection) {
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
      connection.query(query, [newFirstName, newLastName, newEmail, userID], function(err1, rows, fields) {
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



router.post('/deleteUser',function(req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  const { userID } = req.body;

  console.log("went into /deleteUser and userID = " + userID);

  if (userID > 0) {
    //get the connection again
    req.pool.getConnection(function(err,connection) {
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
      connection.query(query, [userID], function(err1, rows, fields) {
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


router.get('/oldPosts', function(req, res, next) {
  console.log("i am in the oldPosts requests index.js!!!");
  const branchID = req.query.branchID;
  //const branchName = req.query.branch;
  const orgID = req.query.orgID;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function(err,connection) {
    //this is the error handling
    if (err) {
      console.log("got connection error for org branch requests!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool in org branch requests");

    // query to get the update posts by the branch
    var oldPostsQuery = "SELECT * FROM Updates WHERE branchID = ?";
    connection.query(oldPostsQuery, [branchID], function(err2, rows2) {
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

router.get('/getBranches', function(req, res, next) {
  console.log("i am in the getBranches requests index.js!!!");
  const orgID = req.query.orgID;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function(err,connection) {
    //this is the error handling
    if (err) {
      console.log("got connection error for org branch requests!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool in org branch requests");
    // First query to get the orgID
    var query = "SELECT * FROM Branch WHERE orgID = ? && instated = 1;";
    connection.query(query, [orgID], function(err1, rows1) {

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


router.get('/getOrgName', function(req, res, next) {
  console.log("i am in the getOrgName requests index.js!!!");
  const orgID = req.query.orgID;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function(err,connection) {
    //this is the error handling
    if (err) {
      console.log("got connection error for org branch requests!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool in org branch requests");
    // First query to get the orgID
    var query = "SELECT orgName FROM Organisations WHERE orgID = ?;";
    connection.query(query, [orgID], function(err1, rows1) {

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

router.get('/getOrgLogo', function(req, res, next) {
  console.log("i am in the getOrgLogo requests index.js!!!");
  const orgID = req.query.orgID;
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function(err,connection) {
    //this is the error handling
    if (err) {
      console.log("got connection error for org branch requests!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool in org branch requests");
    // First query to get the orgID
    var query = "SELECT imgPath FROM Organisations WHERE orgID = ?;";
    connection.query(query, [orgID], function(err1, rows1) {

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


router.post('/createNewPost',function(req, res, next) {
  //we have taken in values and we are wanting to add them into the database, so we set these values to equal some variable name
  // const { branchName, orgID, updateName, updateMsg, dateCreated } = req.body;
  const { branchID, orgID, updateName, updateMsg, dateCreated } = req.body;
  // console.log("THE VALUES PARSED TO CREATE A NEW POST ARE " + branchName, orgID, updateName, updateMsg, dateCreated);
  req.pool.getConnection(function(err,connection) {
    //this is the error handling
    if (err) {
      console.log("got connection error for org branch requests!!!!")
      res.sendStatus(500);
      return;
    }
    //get the last created and used updateID
    var currUpdateIdQuery = "SELECT updateID FROM Updates ORDER BY updateID DESC LIMIT 1;";

    connection.query(currUpdateIdQuery, function(err1, result) {
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
      connection.query(newPostQuery, [currUpdateId, updateName, updateMsg, branchID, dateCreated], function(err2, returnVal) {

        //error handling
        if (err2) {
          //release the query, don't need access to the database anymore
          connection.release();
          console.log("Got error while inserting new post: ", err2);
          res.sendStatus(500);
          return;
        }

        var allPosts = "SELECT * FROM Updates WHERE branchID = ?";
        connection.query(allPosts, [branchID], function(err2, rows2) {
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

router.post('/email', function(req, res, next){
  let info = transporter.sendMail({
    from: "heartfelthelpers@outlook.com", //sender address
    to: req.body.email, //list of recievers
    subject: req.body.subject, //subject line
    text: req.body.text, //plain text body
    html: req.body.text //html body
  })
  res.send()

});

router.post('/emailUpdate', function(req, res, next){
  //find the email list
  //get the connection, we have defined req.pool as our key in app.js, its like a door which opens to the database
  req.pool.getConnection(function(err,connection) {
    //this is the error handling
    if (err) {
      console.log("got error!!!!")
      res.sendStatus(500);
      return;
    }
    console.log("connected to pool");
    //this is the query which i can change
    var query = "SELECT email FROM User WHERE userID IN (SELECT userID FROM FollowedBranches WHERE branchID = ?);";
    //this is us using the query to access/change the database, error is returned in err1, result from query is stored in rows, dont need fields
    connection.query(query, [req.body.branchID], function(err1, rows, fields) {

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

module.exports = router;