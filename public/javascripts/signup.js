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

    var message = document.getElementsByClassName("errorInput")[0];

    //checking for user inputs
    if (who == 0) {

        //email
        if (document.getElementById("userEmail").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter an email";
            return;
        }

        if (document.getElementById("userEmailConfirm").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter a confirmation email";
            return;
        }

        if (document.getElementById("userEmail").value != document.getElementById("userEmailConfirm").value) {
            message.style.display = "block";
            message.textContent = "Please ensure the email addresses entered match";
            return;
        }

        //name
        if (document.getElementById("firstName").value === "" || document.getElementById("lastName").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter your name";
            return;
        }

        //password
        if (document.getElementById("password").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter a password";
            return;
        }

        if (document.getElementById("passwordConfirm").value === "") {
            message.style.display = "block";
            message.textContent = "Please a confirmation password";
            return;
        }

        if (document.getElementById("password").value != document.getElementById("passwordConfirm").value) {
            message.style.display = "block";
            message.textContent = "Please ensure the entered passwords match";
            return;
        }

        //dob
        if (document.getElementById("dateOfBirth").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter your date of birth";
            return;
        }

        var regex = /^\d{2}\/\d{2}\/\d{4}$/;

        if (!regex.test(document.getElementById("dateOfBirth").value)) {
            message.style.display = "block";
            message.textContent = "Please enter the date of birth in the format --/--/----";
            return;
        }

        //location
        if (document.getElementById("suburb").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter a suburb";
            return;
        }

        if (document.getElementById("state").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter a state";
            return;
        }

        var regex2 = /^\d+$/;

        if (document.getElementById("postcode").value === "" || !regex2.test(document.getElementById("postcode").value)) {
            message.style.display = "block";
            message.textContent = "Please enter a postcode (numbers only)";
            return;
        }

        if (document.getElementById("country").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter a country";
            return;
        }

        const email = document.getElementById("userEmail").value;
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const password = document.getElementById("password").value;
        const dob = document.getElementById("dateOfBirth").value;
        const suburb = document.getElementById("suburb").value;
        const state = document.getElementById("state").value;
        const postcode = document.getElementById("postcode").value;
        const country = document.getElementById("country").value;

        console.log("all info okay");
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        console.log("Added successfully!");
                        window.location.href = "/home";
                    } else if (this.status == 400) {
                        console.log("Email already in use");
                        message.style.display = "block";
                        message.textContent = "Email already in use";
                    } else {
                        console.error("Failed to add user. Status:", this.status);
                    }
                }
            }
        };

        xhttp.open("POST", "/addUser", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        console.log(firstName, lastName, email, password, dob, suburb, state, postcode, country);

        xhttp.send(JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            dob: dob,
            suburb: suburb,
            state: state,
            postcode: postcode,
            country: country
        }));
    }

    //checking for organisation inputs
    if (who == 1) {

        //email
        if (document.getElementById("userEmail").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter an email";
            return;
        }

        if (document.getElementById("userEmailConfirm").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter a confirmation email";
            return;
        }

        if (document.getElementById("userEmail").value != document.getElementById("userEmailConfirm").value) {
            message.style.display = "block";
            message.textContent = "Please ensure the email addresses entered match";
            return;
        }

        //company name
        if (document.getElementById("companyName").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter your company's name";
            return;
        }

        //password
        if (document.getElementById("password").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter a password";
            return;
        }

        if (document.getElementById("passwordConfirm").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter a confirmation password";
            return;
        }

        if (document.getElementById("password").value != document.getElementById("passwordConfirm").value) {
            message.style.display = "block";
            message.textContent = "Please ensure the entered passwords match";
            return;
        }

        //location
        if (document.getElementById("suburb").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter a suburb";
            return;
        }

        if (document.getElementById("state").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter an state";
            return;
        }

        var regex2 = /^\d+$/;

        if (document.getElementById("postcode").value === "" || !regex2.test(document.getElementById("postcode").value)) {
            message.style.display = "block";
            message.textContent = "Please enter a postcode (numbers only)";
            return;
        }

        if (document.getElementById("country").value === "") {
            message.style.display = "block";
            message.textContent = "Please enter a country";
            return;
        }

        const name = document.getElementById("companyName").value;
        const email = document.getElementById("userEmail").value;
        const password = document.getElementById("password").value;

        const suburb = document.getElementById("suburb").value;
        const state = document.getElementById("state").value;
        const postcode = document.getElementById("postcode").value;
        const country = document.getElementById("country").value;

        console.log("all info okay");
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        console.log("Added successfully!");
                        window.location.href = "/home";
                    } else if (this.status == 400) {
                        console.log("Email and/or organisation name already in use");
                        message.style.display = "block";
                        message.textContent = "Email and/or organisation name already in use";
                    } else {
                        console.error("Failed to add user. Status:", this.status);
                    }
                }
            }
        };

        xhttp.open("POST", "/addOrg", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        console.log(name, email, password);

        xhttp.send(JSON.stringify({
            name: name,
            email: email,
            password: password,
            suburb: suburb,
            state: state,
            postcode: postcode,
            country: country
        }));

    }

}

function googleSignUp(response) {

    console.log(response);

    //check if user or organisation sign up
    if (document.getElementsByClassName("userButton")[0].style.outline == "auto") {

        var message = document.getElementsByClassName("errorInput2")[0];

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        console.log("Signed up in successfuly!");
                        //redirect to relevant home page
                        //var response = JSON.parse(this.responseText);
                        window.location.href = "/home";
                    } else if (this.status == 400) {
                        console.log("Email already in use");
                        message.style.display = "block";
                        message.textContent = "Email already in use";
                    } else {
                        console.error("Failed to login. Status:", this.status);
                    }
                }
            }
        };

        xhttp.open("POST", "/signUpGoogleUser", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        xhttp.send(JSON.stringify(response));

    } else if (document.getElementsByClassName("organisationButton")[0].style.outline == "auto") {

        var message = document.getElementsByClassName("errorInput2")[0];

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        console.log("Signed up in successfuly!");
                        //redirect to relevant home page
                        //var response = JSON.parse(this.responseText);
                        window.location.href = "/home";
                    } else if (this.status == 400) {
                        console.log("Email already in use");
                        message.style.display = "block";
                        message.textContent = "Email already in use";
                    } else {
                        console.error("Failed to login. Status:", this.status);
                    }
                }
            }
        };

        xhttp.open("POST", "/signUpGoogleOrg", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        xhttp.send(JSON.stringify(response));

    }

 }

document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app'
    });
});
