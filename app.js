var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeGuestRouter = require('./routes/homeGuest.js');
var volunOppRouter = require('./routes/opportunities');
var volunOrgRouter = require('./routes/organisations');
var signUpRouter = require('./routes/signUp');
var loginRouter = require('./routes/logIn');

const { readFileSync } = require('fs');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/opportunities', volunOppRouter); // handles the routes to volun opp page
app.use('/organisations', volunOrgRouter);
app.use('/signUp', signUpRouter);
app.use('/logIn', loginRouter);
app.use('/', homeGuestRouter);
app.use('/users', usersRouter);

module.exports = app;
