
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
                    //console.log("No duplicate!");
                    resolve(false);
                } else if (this.status == 400) {
                    //console.log("Email already in use");
                    resolve(true);
                } else {
                    console.error("Fail. Status:", this.status);
                    resolve(false);
                }
            }
        };

        xhttp.open("POST", "/checkEmail", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        //console.log(email);
        xhttp.send(JSON.stringify({ email: email }));
    });
}

function checkPassword(password) {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    //console.log("Password matches!");
                    resolve(false);
                } else if (this.status == 400) {
                    //console.log("Password fails");
                    resolve(true);
                } else {
                    console.error("Fail. Status:", this.status);
                    resolve(false);
                }
            }
        };

        xhttp.open("POST", "/checkPasswordOrg", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        //console.log(password);
        xhttp.send(JSON.stringify({ password: password }));
    });
}

function checkIfGoogleUser() {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var val = JSON.parse(this.responseText);
                    //console.log("this is the value", val);
                    if (val[0].googleUser == 1) {
                        //console.log("is google user")
                        resolve(true);
                    } else {
                        //console.log("is not google user")
                        resolve(false);
                    }
                } else {
                    console.error("Fail. Status:", this.status);
                    resolve(false);
                }
            }
        };

        xhttp.open("GET", "/checkGoogleOrg", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();
    });
}


async function saveDetails() {
    var message = document.getElementsByClassName("errorInput")[0];

    var email = document.getElementById("email").value;
    var emailConfirm = document.getElementById("emailConfirm").value;

    var name = document.getElementById("name").value;

    var url = document.getElementById("url").value;

    var password = document.getElementById("password").value;
    var newPassword = document.getElementById("newPassword").value;
    var newPasswordConfirm = document.getElementById("newPasswordConfirm").value;

    var called = 0;

    var updateEmail = 0;
    var updateName = 0;
    var updatePassword = 0;
    var updateURL = 0;

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
    if (name) {
        called = 1;
        updateName = 1;
    }

    //link update
    if (url) {
        called = 1;
        updateURL = 1;
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

    // Check if all empty to show error
    if (called === 0) {
        message.style.display = "block";
        message.textContent = "Please enter information";
        return;
    }

    var googleUser = await checkIfGoogleUser();
    if (googleUser) {
        if ( updateEmail || updatePassword ) {
            message.style.display = "block";
            message.textContent = "Cannot edit email or password of google account";
            message.style.color = "red";
            return;
        }
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

    if (updateEmail || updateName || updatePassword || updateURL) {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    //console.log("Details updated successfully!");
                    message.style.display = "block";
                    message.textContent = "Updated successfully";
                    message.style.color = "black";

                    //empty text areas
                    document.getElementById("email").value = "";
                    document.getElementById("emailConfirm").value = "";
                    document.getElementById("name").value = "";
                    document.getElementById("url").value = "";
                    document.getElementById("password").value = "";
                    document.getElementById("newPassword").value = "";
                    document.getElementById("newPasswordConfirm").value = "";

                } else if (this.status == 400) {
                    message.style.display = "block";
                    message.textContent = "Password incorrect";
                } else {
                    console.error("Failed to update details. Status:", this.status);
                }
            }
        };

        xhttp.open("POST", "/updateOrgInfo", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({
            email: email,
            name: name,
            url: url,
            oldPassword: password,
            newPassword: newPassword,
            updateEmail: updateEmail,
            updateName: updateName,
            updatePassword: updatePassword,
            updateURL: updateURL
        }));
    }
}

async function deleteAccount() {
    var message = document.getElementsByClassName("errorInput2")[0];

    var email = document.getElementById("deleteEmail").value;
    var password = document.getElementById("deletePassword").value;

    var googleUser = await checkIfGoogleUser();
    if (googleUser) {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    //console.log("Deleted successfully!");
                    message.style.display = "block";
                    message.textContent = "Account deleted successfully";
                    message.style.color = "black";
                    window.location.href = "/home";
                } else {
                    console.error("Failed to delete. Status:", this.status);
                }
            }
        };

        xhttp.open("POST", "/deleteGoogleOrg", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();
    } else {

        if (email && password) {

            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        //console.log("Deleted successfully!");
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

            xhttp.open("POST", "/deleteSelfOrg", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ password: password, email: email }));

        } else {
            message.style.display = "block";
            message.textContent = "Please enter an email and password";
        }

    }

}

async function onPageLoad() {

    var googleUser = await checkIfGoogleUser();
    if (googleUser) {
        document.getElementById("deleteInput").style.display = "none";
    }

}
window.onload = onPageLoad;