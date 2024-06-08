var urlParams = new URLSearchParams(window.location.search);

// Retrieve individual parameters
var orgName = urlParams.get('orgName');
var orgEmail = urlParams.get('orgEmail');
var orgId = urlParams.get('orgID');

// //console.log(orgName + orgEmail);
// var orgId = 0;
function getOrgId() {
    urlParams = new URLSearchParams(window.location.search);

    // Retrieve individual parameters
    orgName = urlParams.get('orgName');
    orgEmail = urlParams.get('orgEmail');
    //console.log("Loading getOrgId!, the orgName and orgEmail are " + orgName + " " + orgEmail);

    //console.log("went into getOrgId function");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // //console.log(xhttp.responseText);
            //parse it correctly (it comes back as an array, but we are only using the one row)
            let info = JSON.parse(this.responseText)[0];

            orgId = info.orgID;
            //console.log("the orgId is = " + orgId);
        }
    };
    xhttp.open("POST", "/orgId", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ orgName: orgName, orgEmail: orgEmail }));
}

//set all the inputs to be the database values
function loadInfo() {
    //make sure that the box is not set to be hidden
    const orgEditDiv = document.querySelector('.organisationEdit');
    if (orgEditDiv.classList.contains('hidden')) {
        orgEditDiv.classList.remove('hidden');
    }

    urlParams = new URLSearchParams(window.location.search);

    // Retrieve individual parameters
    orgName = urlParams.get('orgName');
    orgEmail = urlParams.get('orgEmail');
    //console.log("Loading!, the orgName and orgEmail are " + orgName + " " + orgEmail);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // //console.log(xhttp.responseText);
            //parse it correctly (it comes back as an array, but we are only using the one row)
            let info = JSON.parse(this.responseText)[0];
            // if (info) {
            //     ////console.log("it parsed through the details!");
            // }
            // else {
            //     ////console.log("did not parsed through the details!")
            // }

            //console.log(info.orgName + info.orgEmail);

            //update the text input placeholder values
            var orgNameInput = document.getElementById("orgName");
            var orgEmailInput = document.getElementById("orgEmail");

            orgNameInput.placeholder = info.orgName;
            orgEmailInput.placeholder = info.email;

            var orgDescriptionInput = document.getElementById("orgDescription");
            orgDescriptionInput.value = info.description;

            const descTextarea = document.getElementById('orgDescription');
            const descCount = document.querySelector('.descCount');
            const max = 750;


            function updateCharacterCount() {
                const remaining = max - descTextarea.value.length;
                descCount.textContent = remaining;
            }

            updateCharacterCount();


            descTextarea.onkeyup = updateCharacterCount;
        }
    };
    xhttp.open("POST", "/orgInfo", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // xhttp.send(JSON.stringify({ orgId: orgId}));
    xhttp.send(JSON.stringify({ orgName: orgName, orgEmail: orgEmail }));
}


var saveLabelShowing = false;

function saveOrganisationInfoConfirm() {
    // Save the info in database
    // Get the form values
    const newOrgName = document.getElementById('orgName').value.trim(); // Trim whitespace
    const newOrgEmail = document.getElementById('orgEmail').value.trim();
    const newOrgDescription = document.getElementById('orgDescription').value.trim();

    // Check if any of the fields are empty or contain only whitespace
    if (newOrgName === "" || newOrgEmail === "" || newOrgDescription === "") {
        alert("Please fill out all fields.");
        return; // Exit function if any field is empty
    }

    //console.log("the orgId is = " + orgId);
    //console.log("in saveOrganisationInfoConfirm adminEdit.js the values being parsed are" + orgId + " " + newOrgName + " " + newOrgEmail + " " + newOrgDescription);

    if (newOrgName != orgName) {
        var xhttp1 = new XMLHttpRequest();
        xhttp1.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    handleSaveSuccess();
                } else {
                    alert("Organization name already taken");
                }
            }
        };
        xhttp1.open("POST", "/saveOrgInfoNewName", true);
        xhttp1.setRequestHeader("Content-type", "application/json");
        xhttp1.send(JSON.stringify({ orgId: orgId, newOrgName: newOrgName, newOrgEmail: newOrgEmail, newOrgDescription: newOrgDescription }));
    } else {
        var xhttp2 = new XMLHttpRequest();
        xhttp2.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    handleSaveSuccess();
                } else {
                    alert("An error occurred while saving the organization information");
                }
            }
        };
        xhttp2.open("POST", "/saveOrgInfoOldName", true);
        xhttp2.setRequestHeader("Content-type", "application/json");
        xhttp2.send(JSON.stringify({ orgId: orgId, newOrgName: newOrgName, newOrgEmail: newOrgEmail, newOrgDescription: newOrgDescription }));
    }
}

function handleSaveSuccess() {
    // Show the label and hide everything else if new name
    if (!saveLabelShowing) {
        var confirmSave = document.createElement('div');
        confirmSave.id = 'saveSuccess';
        confirmSave.innerHTML = '<p>Organization information saved!</p>';

        var parent = document.querySelector('.contentWrapper');
        var button = document.getElementById('backToSearch');

        // Insert the confirmSave div before the button
        parent.insertBefore(confirmSave, button);
        saveLabelShowing = true;
    }

    // Hide everything else
    document.querySelector('.organisationEdit').classList.add('hidden');
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


    //TESTING PLS REMOVE THIS, DON'T WANT TO ALWASY DELETE THE  ORGANAISATION WITH ID = 1
    // orgId = 1;
    //console.log("deleteOrgnaisation: The orgId is " + orgId);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // //console.log(xhttp.responseText);
            //console.log("deleted the organisation!");
        }
    };
    xhttp.open("POST", "/deleteOrg", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ orgId: orgId }));
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

document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app'
    });
});