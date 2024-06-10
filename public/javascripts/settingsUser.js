
document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app'
    });
});

function checkDuplicateEmail(email) {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    console.log("No duplicate!");
                    resolve(false);
                } else if (this.status == 400) {
                    console.log("Email already in use");
                    resolve(true);
                } else {
                    console.error("Fail. Status:", this.status);
                    resolve(false);
                }
            }
        };

        xhttp.open("POST", "/checkEmail", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        console.log(email);
        xhttp.send(JSON.stringify({ email: email }));
    });
}

function checkPassword(password) {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    console.log("Password matches!");
                    resolve(false);
                } else if (this.status == 400) {
                    console.log("Password fails");
                    resolve(true);
                } else {
                    console.error("Fail. Status:", this.status);
                    resolve(false);
                }
            }
        };

        xhttp.open("POST", "/checkPassword", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        console.log(password);
        xhttp.send(JSON.stringify({ password: password }));
    });
}

async function saveDetails() {
    var message = document.getElementsByClassName("errorInput")[0];

    var email = document.getElementById("email").value;
    var emailConfirm = document.getElementById("emailConfirm").value;

    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;

    var password = document.getElementById("password").value;
    var newPassword = document.getElementById("newPassword").value;
    var newPasswordConfirm = document.getElementById("newPasswordConfirm").value;

    var suburb = document.getElementById("suburb").value;
    var state = document.getElementById("state").value;
    var postcode = document.getElementById("postcode").value;
    var country = document.getElementById("country").value;

    var checkboxFull = document.getElementById("emailBox").checked;

    var called = 0;

    var updateEmail = 0;
    var updateName = 0;
    var updatePassword = 0;
    var updateLocation = 0;
    var updateEmailPreference = 0;

    // Email update
    if (email && emailConfirm) {
        called = 1;
        if (email !== emailConfirm) {
            message.style.display = "block";
            message.textContent = "Emails entered do not match";
            return;
        } else {
            updateEmail = 1;
        }
    }

    // Name update
    if (firstName && lastName) {
        called = 1;
        updateName = 1;
    }

    // Password update
    if (password && newPassword && newPasswordConfirm) {
        called = 1;
        if (newPassword !== newPasswordConfirm) {
            message.style.display = "block";
            message.textContent = "New passwords entered do not match";
            return;
        } else {
            updatePassword = 1;
        }
    }

    // Location update
    if (suburb && state && postcode && country) {
        called = 1;
        updateLocation = 1;
    }

    // Email preference update
    if (checkboxFull) {
        called = 1;
        updateEmailPreference = 1;
    }

    // Check if all empty to show error
    if (called === 0) {
        message.style.display = "block";
        message.textContent = "Please enter information";
        return;
    }

    if (updateEmail) {
        var duplicate = await checkDuplicateEmail(email);
        if (duplicate) {
            message.style.display = "block";
            message.textContent = "Email already in use";
            message.style.color = "red";
            return;
        }
    }

    if (updatePassword) {
        var passWrong = await checkPassword(password);
        if (passWrong) {
            message.style.display = "block";
            message.textContent = "Current password incorrect";
            message.style.color = "red";
            return;
        }
    }

    if (updateEmail || updateName || updatePassword || updateLocation || updateEmailPreference) {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    console.log("Details updated successfully!");
                    message.style.display = "block";
                    message.textContent = "Updated successfully";
                    message.style.color = "black";

                    //empty text areas
                    document.getElementById("email").value = "";
                    document.getElementById("emailConfirm").value = "";
                    document.getElementById("firstName").value = "";
                    document.getElementById("lastName").value = "";
                    document.getElementById("password").value = "";
                    document.getElementById("newPassword").value = "";
                    document.getElementById("newPasswordConfirm").value = "";
                    document.getElementById("suburb").value = "";
                    document.getElementById("state").value = "";
                    document.getElementById("postcode").value = "";
                    document.getElementById("country").value = "";

                } else if (this.status == 400) {
                    message.style.display = "block";
                    message.textContent = "Password incorrect";
                } else {
                    console.error("Failed to update details. Status:", this.status);
                }
            }
        };

        xhttp.open("POST", "/updateUserInfo", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({
            email: email,
            firstName: firstName,
            lastName: lastName,
            oldPassword: password,
            newPassword: newPassword,
            suburb: suburb,
            state: state,
            postcode: postcode,
            country: country,
            checkboxFull: checkboxFull,
            updateEmail: updateEmail,
            updateName: updateName,
            updatePassword: updatePassword,
            updateLocation: updateLocation,
            updateEmailPreference: updateEmailPreference
        }));
    }
}

function deleteAccount() {
    var message = document.getElementsByClassName("errorInput2")[0];

    var email = document.getElementById("deleteEmail").value;
    var password = document.getElementById("deletePassword").value;

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                console.log("Deleted successfully!");
                message.style.display = "block";
                message.textContent = "Account deleted successfully";
                message.style.color = "black";
                window.location.href = "/home";
            } else if (this.status == 400) {
                message.style.display = "block";
                message.textContent = "Details incorrect";
            } else {
                console.error("Failed to delete. Status:", this.status);
            }
        }
    };

    xhttp.open("POST", "/deleteSelfUser", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ password: password, email: email }));

}