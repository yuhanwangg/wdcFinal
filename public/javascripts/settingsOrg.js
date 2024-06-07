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

        xhttp.open("POST", "/checkPasswordOrg", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        console.log(password);
        xhttp.send(JSON.stringify({ password: password }));
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
                    console.log("Details updated successfully!");
                    message.style.display = "block";
                    message.textContent = "Updated successfully";
                    message.style.color = "black";
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

    xhttp.open("POST", "/deleteSelfOrg", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ password: password, email: email }));

}