var saveLabelShowing = false;
function saveOrganisationInfoConfirm() {
    if (saveLabelShowing === false) {
        var confirmSave = document.createElement('div');
        confirmSave.id = 'saveSuccess';
        confirmSave.innerHTML = '<p>Organisation information saved!</p>';

        var parent = document.querySelector('.contentWrapper');
        parent.appendChild(confirmSave);
        saveLabelShowing = true;
    }
}

function deleteOrganisation() {
    //remove the text box and replace with a single box confirming with a back button
    var parent = document.getElementById('confirmBox');
    parent.remove();

    var deletedSuccess = document.createElement('div');
    deletedSuccess.id = 'deletedSuccess';
    deletedSuccess.innerHTML = '<p>Organisation deleted!</p><button class="backToOrganisations" onclick="backToOrganisations()">Back To Organisations</button></div>';
    var content = document.querySelector('.contentWrapper');
    content.appendChild(deletedSuccess);
}

function checkDeleteOrganisatoin() {
    //remove the user info
    var entireOrganisation = document.getElementsByClassName('organisationEdit')[0];
    entireOrganisation.remove();

    //remove the save user info box if on
    if (saveLabelShowing === true) {
        saveLabelShowing = false;
        var saveLabel = document.getElementById('saveSuccess');
        saveLabel.remove();
    }

    //add a pop up box
    var confirmBox = document.createElement('div');
    confirmBox.id = 'confirmBox';
    confirmBox.innerHTML = '<p>Do you wish to delete the organisation?</p><div class="confirmButtons"><button class="confirmDelete" onclick="deleteOrganisation()">Delete Organisation</button><button class="back" onclick="backToOrganisations()">Back</button></div>';


    var parent = document.querySelector('.contentWrapper');
    parent.appendChild(confirmBox);
}

function backToOrganisations() {
    window.location.href = "AdminOrganisation.html";
}