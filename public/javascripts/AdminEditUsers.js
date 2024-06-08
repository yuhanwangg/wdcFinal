
var urlParams = new URLSearchParams(window.location.search);

// Retrieve individual parameters
var userID = urlParams.get('userID');

var saveLabelShowing = false;

document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app'
    });
});

function loadInfo() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // //console.log(xhttp.responseText);
            //parse it correctly (it comes back as an array, but we are only using the one row)
            let info = JSON.parse(this.responseText)[0];
            if (info) {
                //console.log("it parsed through the details!");
            }
            else {
                //console.log("did not parsed through the details!")
            }

            //update the text input placeholder values
            var firstNameInput = document.getElementById("firstNameInput");
            firstNameInput.placeholder = info.firstName;

            var lastNameInput = document.getElementById("lastNameInput");
            lastNameInput.placeholder = info.lastName;

            var emailInput = document.getElementById("emailInput");
            emailInput.value = info.email;
        }
    };
    xhttp.open("POST", "/userInfo", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ userID: userID }));
}


function saveUserInfoConfirm() {
    var userEditElement = document.getElementById('UserEdit');

    //get the form values
    const newFirstName = document.getElementById('firstNameInput').value.trim();
    const newLastName = document.getElementById('lastNameInput').value.trim();
    const newEmail = document.getElementById('emailInput').value.trim();


    // Check if any of the fields are empty or contain only whitespace
    if (newFirstName === "" || newLastName === "" || newEmail === "") {
        alert("Please fill out all fields.");
        return; // Exit function if any field is empty
    }

    if (userEditElement) {
        if (saveLabelShowing === false) {
            var confirmSave = document.createElement('div');
            confirmSave.id = 'saveSuccess';
            confirmSave.innerHTML = '<p>User information saved!</p>';

            var parent = document.querySelector('.contentWrapper');
            var button = document.getElementById('backToSearch');
            parent.insertBefore(confirmSave, button);
            saveLabelShowing = true;
        }

        //hide everything else
        userEditElement.classList.add('hidden');

        //save the info in database
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //console.log("changed successfully!")
            }
        };
        xhttp.open("POST", "/saveUserInfo", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({ userID: userID, newFirstName: newFirstName, newLastName: newLastName, newEmail: newEmail }));
    } else {
        //console.error("Element with ID 'UserEdit' not found.");
    }
}


function deleteUser() {
    //remove the text box and replace with a single box confirming with a back button
    var parent = document.getElementById('confirmBox');
    parent.remove();

    var deletedSuccess = document.createElement('div');
    deletedSuccess.id = 'deletedSuccess';
    deletedSuccess.innerHTML = '<p>User deleted!</p><button class="back" onclick="backToUsers()">Back To Users</button></div>';
    var content = document.querySelector('.contentWrapper');
    content.appendChild(deletedSuccess);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // //console.log(xhttp.responseText);
            //console.log("deleted the user!");
        }
    };
    xhttp.open("POST", "/deleteUser", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ userID: userID }));
}

function checkDeleteUser() {
    //remove the user info
    var entireUser = document.getElementById('UserEdit');
    entireUser.remove();

    //remove the back to search button
    var backButton = document.getElementById('backToSearch');
    backButton.remove();

    //remove the save user info box if on
    if (saveLabelShowing === true) {
        saveLabelShowing = false;
        var saveLabel = document.getElementById('saveSuccess');
        saveLabel.remove();
    }

    //add a pop up box
    var confirmBox = document.createElement('div');
    confirmBox.id = 'confirmBox';
    confirmBox.innerHTML = '<p>Do you wish to delete the user?</p><div class="confirmButtons"><button class="confirmDelete" onclick="deleteUser()">Delete User</button><button class="back" onclick="backToUsers()">Back</button></div>';


    var parent = document.querySelector('.contentWrapper');
    parent.appendChild(confirmBox);
}

function backToUsers() {
    window.location.href = "AdminUsers.html";
}