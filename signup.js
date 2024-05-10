function selectUser() {
    var userFields = document.getElementsByClassName("userField");

    for (var i = 0; i < userFields.length; i++) {
        userFields[i].style.display = "block";
    }

    var orgFields = document.getElementsByClassName("orgField");

    for (var i = 0; i < orgFields.length; i++) {
        orgFields[i].style.display = "none";
    }

    document.getElementsByClassName("userButton")[0].style.outline = "auto";
    document.getElementsByClassName("userButton")[0].style.outline.style = "solid";

    document.getElementsByClassName("organisationButton")[0].style.outline = "none";
    document.getElementsByClassName("organisationButton")[0].style.outline.style = "none";
}

function selectOrg() {
    var userFields = document.getElementsByClassName("userField");

    for (var i = 0; i < userFields.length; i++) {
        userFields[i].style.display = "none";
    }

    var orgFields = document.getElementsByClassName("orgField");

    for (var i = 0; i < orgFields.length; i++) {
        orgFields[i].style.display = "block";
    }

    document.getElementsByClassName("userButton")[0].style.outline = "none";
    document.getElementsByClassName("userButton")[0].style.outline.style = "none";

    document.getElementsByClassName("organisationButton")[0].style.outline = "auto";
    document.getElementsByClassName("organisationButton")[0].style.outline.style = "solid";
}

function sendInfo() {
//success or not all filled in message
//redirect to signed in home page based on user or organisation
}