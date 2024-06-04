var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeGuestRouter = require('./routes/homeGuest.js');
const { readFileSync } = require('fs');

//connect to RDBMS in express
var mysql = require('mysql');
var dbConnectionPool = mysql.createPool({
    host:'localhost',
    database:'WDCProject'
});

var app = express();

app.use(function(req, res, next) {
    console.log("I created connection pool");
    req.pool=dbConnectionPool;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
//NEEDS TO BE CHANGED TO BELOW, ONLY WORKS ONCE ALL HEADERS WORK AND ARE IMPLEMENTED
//app.use('/', homeGuestRouter);
app.use('/users', usersRouter);

module.exports = app;