var express = require('express');
var mysql = require('mysql');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeGuestRouter = require('./routes/home');
var volunOppRouter = require('./routes/opportunities');
var volunOrgRouter = require('./routes/organisations');
var signUpRouter = require('./routes/signUp');
var loginRouter = require('./routes/logIn');


const { readFileSync } = require('fs');
const { validateHeaderName } = require('http');

//connect to RDBMS in express
var mysql = require('mysql');
var dbConnectionPool = mysql.createPool({
    host: 'localhost',
    database: 'WDCProject'
});


var app = express();

app.use(function (req, res, next) {
    console.log("I created connection pool");
    req.pool = dbConnectionPool;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//added for sessions
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'a secret string',
    cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/opportunities', volunOppRouter); // handles the routes to volun opp page
app.use('/organisations', volunOrgRouter);
app.use('/signUp', signUpRouter);
app.use('/logIn', loginRouter);
app.use('/home', homeGuestRouter);
app.use('/users', usersRouter);


module.exports = app;