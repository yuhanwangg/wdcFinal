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

var who = -1; //if = 0, user sign up, if = 1, org sign up

//check if user or organisation sign up
if (document.getElementsByClassName("userButton")[0].style.outline == "auto") {
    who = 0;
} else if (document.getElementsByClassName("organisationButton")[0].style.outline == "auto") {
    who = 1;
}

//checking for user inputs
if (who == 0) {

    //email
    if (document.getElementById("userEmail").value === "") {
        alert("Please enter an email");
        document.getElementById("userEmail").style.color = "red";
        return;
    }

    if (document.getElementById("userEmailConfirm").value === "") {
        alert("Please enter a confirmation email");
        return;
    }

    if (document.getElementById("userEmail").value != document.getElementById("userEmailConfirm").value) {
        alert("Please ensure the email addresses entered match");
        return;
    }

    //name
    if (document.getElementById("firstName").value === "" || document.getElementById("lastName").value === "") {
        alert("Please enter your name");
        return;
    }

    //password
    if (document.getElementById("password").value === "") {
        alert("Please enter a password");
        return;
    }

    if (document.getElementById("passwordConfirm").value === "") {
        alert("Please enter a confirmation password");
        return;
    }

    if (document.getElementById("password").value != document.getElementById("passwordConfirm").value) {
        alert("Please ensure the passwords entered match");
        return;
    }

    //dob
    if (document.getElementById("dateOfBirth").value === "") {
        alert("Please enter your date of birth");
        return;
    }

    var regex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!regex.test(document.getElementById("dateOfBirth").value)) {
        alert("Please enter the date of birth in the format --/--/----.");
        return;
      }

    //location
    if (document.getElementById("suburb").value === "") {
        alert("Please enter a suburb");
        return;
    }

    if (document.getElementById("state").value === "") {
        alert("Please enter a state");
        return;
    }

    var regex2 = /^\d+$/;

    if (document.getElementById("postcode").value === "" || !regex2.test(document.getElementById("postcode").value)) {
        alert("Please enter a postcode (numbers only)");
        return;
    }

    if (document.getElementById("country").value === "") {
        alert("Please enter a country");
        return;
    }

    alert("Sign up success!");

}

//checking for organisation inputs
if (who == 1) {

        //email
        if (document.getElementById("userEmail").value === "") {
            alert("Please enter an email");
            document.getElementById("userEmail").style.color = "red";
            return;
        }

        if (document.getElementById("userEmailConfirm").value === "") {
            alert("Please enter a confirmation email");
            return;
        }

        if (document.getElementById("userEmail").value != document.getElementById("userEmailConfirm").value) {
            alert("Please ensure the email addresses entered match");
            return;
        }

        //company name
        if (document.getElementById("companyName").value === "") {
            alert("Please enter your name");
            return;
        }

        //password
        if (document.getElementById("password").value === "") {
            alert("Please enter a password");
            return;
        }

        if (document.getElementById("passwordConfirm").value === "") {
            alert("Please enter a confirmation password");
            return;
        }

        if (document.getElementById("password").value != document.getElementById("passwordConfirm").value) {
            alert("Please ensure the passwords entered match");
            return;
        }

        //location
        if (document.getElementById("suburb").value === "") {
            alert("Please enter a suburb");
            return;
        }

        if (document.getElementById("state").value === "") {
            alert("Please enter a state");
            return;
        }

        var regex2 = /^\d+$/;

        if (document.getElementById("postcode").value === "" || !regex2.test(document.getElementById("postcode").value)) {
            alert("Please enter a postcode (numbers only)");
            return;
        }

        if (document.getElementById("country").value === "") {
            alert("Please enter country");
            return;
        }

        alert("Sign up success!");

}


//redirect to signed in home page based on user or organisation
}