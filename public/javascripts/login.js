function login() {
    const email = document.getElementById("emailField").value;
    const password = document.getElementById("passwordField").value;

    var message = document.getElementsByClassName("errorInput")[0];

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    //console.log("Logged in successfuly!");

                    //redirect to relevant home page
                    var response = JSON.parse(this.responseText);

                    // if (response.userType === 'volunteer') {
                    //     window.location.href = "/homeVolunteer.html";
                    // } else if (response.userType === 'organisation') {
                    //     window.location.href = "/homeOrgVerified.html";
                    // } else if (response.userType === 'admin') {
                    //     window.location.href = "/homeGuest.html";
                    // }
                    window.location.href = "/home";

                } else if (this.status == 400) {
                    //console.log("Email or password is incorrect");
                    message.style.display = "block";
                    message.textContent = "Email or password is incorrect";
                } else {
                    console.error("Failed to login. Status:", this.status);
                }
            }
        }
    };

    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    //console.log(email, password);

    xhttp.send(JSON.stringify({
        email: email,
        password: password
    }));


}

function googleLogin(response) {

    //console.log(response);

    var message = document.getElementsByClassName("errorInput2")[0];

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    //console.log("Logged in successfuly!");
                    //redirect to relevant home page
                    //var response = JSON.parse(this.responseText);
                    window.location.href = "/home";
                } else if (this.status == 400) {
                    //console.log("You need to sign up before signing in");
                    message.style.display = "block";
                    message.textContent = "You must sign up with google before signing in";
                } else {
                    console.error("Failed to login. Status:", this.status);
                }
            }
        }
    };

    xhttp.open("POST", "/loginGoogle", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.send(JSON.stringify(response));

    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    // const responsePayload = decodeJwtResponse(response.credential);

    // console.log("ID: " + responsePayload.sub);
    // console.log('Full Name: ' + responsePayload.name);
    // console.log('Given Name: ' + responsePayload.given_name);
    // console.log('Family Name: ' + responsePayload.family_name);
    // console.log("Image URL: " + responsePayload.picture);
    // console.log("Email: " + responsePayload.email);
 }

document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app'
    });
});