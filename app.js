var express = require('express');
var mysql = require('mysql');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var logger = require('morgan');
var session = require('express-session');

//middleware for checking that user has access to a page
var checkSession = require('./routes/checkSession');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeGuestRouter = require('./routes/home');
var volunOppRouter = require('./routes/opportunities');
var volunOrgRouter = require('./routes/organisations');
var signUpRouter = require('./routes/signUp');
var loginRouter = require('./routes/logIn');
var settingsRouter = require('./routes/settings');
var updatesRouter = require('./routes/updates');
var registerBranchRouter = require('./routes/registerBranch');
var joinedUsersRouter = require('./routes/joinedUsers');
var editUserRouter = require('./routes/editUser');
var rsvpRouter = require('./routes/rsvpd');
var successRSVPdRouter = require('./routes/successRSVPd');

const { readFileSync } = require('fs');
const { validateHeaderName } = require('http');

//connect to RDBMS in express
var mysql = require('mysql');
const { register } = require('module');
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

app.use('/organisation_logos', express.static(path.join(__dirname, 'organisation_logos')));

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

//admin pages - takes you back to respective home page if you don't have access depending on accountID and userType from session token
app.use('/AdminCreateAdmin.html', checkSession.checkAdmin);
app.use('/AdminEditOrganisations.html', checkSession.adminEditOrgPage);
app.use('/AdminEditUsers.html', checkSession.adminEditUserPage);
app.use('/AdminOrganisation.html', checkSession.checkAdmin);
app.use('/AdminUsers.html', checkSession.checkAdmin);
app.use('/settingsAdmin.html', checkSession.checkAdmin);
app.use('/editUser', checkSession.checkAdmin);

//organisation pages
app.use('/CreateVolunteerOpportunity.html', checkSession.checkOrganisation);
app.use('/homeOrgNoVerify.html', checkSession.orgVerifyNoVerify);
app.use('/homeOrgVerified.html', checkSession.orgVerifyNoVerify);
app.use('/MoreInformationOpportunityOrg.html', checkSession.checkOrganisation);
app.use('/organisationsJoinedUsers.html', checkSession.checkOrganisation);
app.use('/registerBranch.html', checkSession.checkOrganisation);
app.use('/settingsOrg.html', checkSession.checkOrganisation);
app.use('/UpdatesOrganisations.html', checkSession.checkOrganisation);
app.use('/VolunteerOpportunitiesOrg.html', checkSession.checkOrganisation);
app.use('/registerBranch.html', checkSession.checkOrganisation);
app.use('/joinedUser.html', checkSession.checkOrganisation);

//User pages
app.use('/homeVolunteer.html', checkSession.checkVolunteer);
app.use('/MoreInformationOpportunityUser.html', checkSession.checkVolunteer);
app.use('/rsvp.html', checkSession.checkVolunteer);
app.use('/settingsUser.html', checkSession.checkVolunteer);
app.use('/successRSVPd.html', checkSession.checkVolunteer);
app.use('/successRSVPd.html', checkSession.checkVolunteer);
app.use('/VolunteerOpportunitiesUser.html', checkSession.checkVolunteer);


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/opportunities', volunOppRouter); // handles the routes to volun opp page
app.use('/organisations', volunOrgRouter);
app.use('/signUp', signUpRouter);
app.use('/logIn', loginRouter);
app.use('/home', homeGuestRouter);
app.use('/settings', settingsRouter);
app.use('/updates', updatesRouter);
app.use('/registerBranch', registerBranchRouter);
app.use('/joinedUsers', joinedUsersRouter);
app.use('/editUser', editUserRouter);
app.use('/users', usersRouter);
app.use('/successRSVPd', successRSVPdRouter);
app.use('/rsvpd', rsvpRouter);

module.exports = app;