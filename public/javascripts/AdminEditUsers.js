var saveLabelShowing = false;
function saveUserInfoConfirm() {
    if (saveLabelShowing === false) {
        var confirmSave = document.createElement('div');
        confirmSave.id = 'saveSuccess';
        confirmSave.innerHTML ='<p>User information saved!</p>';

        var parent = document.querySelector('.contentWrapper');
        parent.appendChild(confirmSave);
        saveLabelShowing = true;
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
}

function checkDeleteUser() {
    //remove the user info
    var entireUser = document.getElementById('UserEdit');
    entireUser.remove();

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
    window.location.href="AdminUsers.html";
}