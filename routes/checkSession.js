// middleware/checkSession.js

function checkVolunteer(req, res, next) {
  const accountID = req.session.accountID;

  if (!accountID) {
    // No account ID, redirect to home
    return res.redirect('/');
  }

  const accountType = req.session.userType;

  if (accountType !== 'volunteer') {
    // Not an volunteer, redirect to home
    return res.redirect('/');
  }

  // User is valid
  next();
}

function checkOrganisation(req, res, next) {
  const accountID = req.session.accountID;

  if (!accountID) {
    // No account ID, redirect to home
    return res.redirect('/');
  }

  const accountType = req.session.userType;

  if (accountType !== 'organisation') {
    // Not an organisation, redirect to home
    return res.redirect('/');
  }

  // User is valid
  next();
}

function checkAdmin(req, res, next) {
  const accountID = req.session.accountID;

  if (!accountID) {
    // No account ID, redirect to home
    return res.redirect('/');
  }

  const accountType = req.session.userType;

  if (accountType !== 'admin') {
    // Not an admin, redirect to home
    return res.redirect('/');
  }

  // User is valid
  next();
}

function adminEditOrgPage(req, res, next) {
  const accountID = req.session.accountID;

  if (!accountID) {
    // No account ID, redirect to home
    return res.redirect('/');
  }

  const accountType = req.session.userType;

  if (accountType !== 'admin') {
    // Not an admin, redirect to home
    return res.redirect('/');
  }

  // admin is valid, but only allow to go to the non-specific edit Org page
    // Check if there are any query parameters, if there are then the admin clicked the edit button, if there aren't then the user typed in the url
  if (Object.keys(req.query).length === 0) {
    return res.redirect('/editOrganisations');
  }
  next();
}

function adminEditUserPage(req, res, next) {
  const accountID = req.session.accountID;

  if (!accountID) {
    // No account ID, redirect to home
    return res.redirect('/');
  }

  const accountType = req.session.userType;

  if (accountType !== 'admin') {
    // Not an admin, redirect to home
    return res.redirect('/');
  }

  // admin is valid, but only allow to go to the non-specific edituser page
  // Check if there are any query parameters, if there are then the admin clicked the edit button, if there aren't then the user typed in the url
  if (Object.keys(req.query).length === 0) {
    return res.redirect('/editUser');
  }

  next();
}

function orgVerifyNoVerify(req, res, next) {

  //return to the correct verfied or non-verfied home page, or regular home page for all other users if not an organisation
  return res.redirect('/');

}


module.exports = {
  checkVolunteer,
  checkOrganisation,
  checkAdmin,
  adminEditOrgPage,
  adminEditUserPage,
  orgVerifyNoVerify
};
