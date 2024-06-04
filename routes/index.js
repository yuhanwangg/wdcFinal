var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
router.use(bodyParser.json());
var adminIdCounter = 1;

var mysql = require('mysql');

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

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/home'); // Redirect to /home
});

/* GET user count from database */
router.get('/userCount', function (req, res, next) {
  console.log('johhny boi');
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
router.get('/recentPosts', function (req, res, next) {
  const query = 'SELECT * FROM Opportunities ORDER BY dates DESC LIMIT 3'; // Change the limit as needed
  connection.query(query, function (error, results, fields) {
    if (error) {
      console.error('Error querying database: ' + error.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

module.exports = router;