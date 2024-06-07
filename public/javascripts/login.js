function forgotPassword() {

    //go to forgot password page that i need to make
    //there user can input email, email is sent to them,
    //link directs to forgot password page

}

function login() {
    const email = document.getElementById("emailField").value;
    const password = document.getElementById("passwordField").value;

    var message = document.getElementsByClassName("errorInput")[0];

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    console.log("Logged in successfuly!");

                    //redirect to relevant home page
                    var response = JSON.parse(this.responseText);

                    if (response.userType === 'volunteer') {
                        window.location.href = "/homeVolunteer.html";
                    } else if (response.userType === 'organisation') {
                        window.location.href = "/homeOrgVerified.html";
                    } else if (response.userType === 'admin') {
                        window.location.href = "/homeGuest.html";
                    }
                } else if (this.status == 400) {
                    console.log("Email or password is incorrect");
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

    console.log(email, password);

    xhttp.send(JSON.stringify({
        email: email,
        password: password
    }));


}