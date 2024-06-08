const { checkout } = require("../../routes");

var notFoundShowing = false;
var orgDetailsShowing = false;
var branchRequestsShowing = false;
var currBranchesShowing = false;


function findOrganisation() {
    //console.log("WER ARE RIGHT HERE!!! went into find Org function");
    const inputedName = document.getElementById('orgName');
    const inputedEmail = document.getElementById('orgEmail');
    //console.log("inputted values are " + inputedName.value + " " + inputedEmail.value);

    //get the org details
    var xhttp1 = new XMLHttpRequest();
    xhttp1.onreadystatechange = function () {
        ////console.log("xhttp1 called");
        if (this.readyState == 4 && this.status == 200) {
            //remove current info/error messages showing
            if (notFoundShowing) {
                var notFoundMsg1 = document.getElementById('notFound');
                notFoundMsg1.remove();
                notFoundShowing = false;
            }

            if (orgDetailsShowing) {
                var orgDetailBox1 = document.getElementsByClassName('organisationBox')[0];
                orgDetailBox1.remove();
                orgDetailsShowing = false;
            }

            if (branchRequestsShowing) {
                var allBranchRequests1 = document.getElementsByClassName('branchRequests');
                if (allBranchRequests1.length > 0) {
                    allBranchRequests1[0].remove();
                }
                branchRequestsShowing = false;
            }

            if (currBranchesShowing) {
                var totalCurrBranches1 = document.getElementsByClassName('currentBranches');
                if (totalCurrBranches1.length > 0) {
                    totalCurrBranches1[0].remove();
                }
                currBranchesShowing = false;
            }

            let orgDetails = JSON.parse(this.responseText);
            //console.log("got these details of the org: " + orgDetails.orgName + orgDetails.email + orgDetails.description);
            // add each org detail element into the organisationBox

            //fill in the info
            //create the info box
            var orgBox = document.createElement('div');
            orgBox.className = "organisationBox";

            //create the name pargraph
            var name = document.createElement('p');
            name.className = "name";
            name.innerText = orgDetails.orgName;

            //create the email paragraph
            var email = document.createElement('p');
            email.innerText = orgDetails.email;

            //create the description and button
            var descriptionAndButton = document.createElement('div');
            descriptionAndButton.className = "paragraphAndButton";

            //create description
            var description = document.createElement('p');
            description.innerText = orgDetails.description;

            //create button
            var editButton = document.createElement('button');
            editButton.onclick = function () {
                goToEditOrganisation(orgDetails.orgID);
            };


            editButton.innerText = "Edit";

            //append the description and button to the div
            descriptionAndButton.appendChild(description);
            descriptionAndButton.appendChild(editButton);

            //append everyting to the box
            orgBox.appendChild(name);
            orgBox.appendChild(email);
            orgBox.appendChild(descriptionAndButton);

            //append everything to the search bar
            var fullOrganisationBox = document.querySelector('.orgBox');
            fullOrganisationBox.appendChild(orgBox);
            orgDetailsShowing = true;

            //console.log("ABOUT TO FETCH CURR BRANHCES");
            //get the branch info
            fetchBranchRequests(fetchCurrBranches);
            // fetchCurrBranches();

        }
        else if (this.status === 404) {
            //console.log("went into 404 else statement");
            //console.log("the value of notFoundShowing = " + notFoundShowing);
            //send in a error message saying not found
            if (!notFoundShowing) {
                //console.log("not found is not showing");
                var notFoundMsg = document.createElement('div');
                notFoundMsg.id = 'notFound';
                notFoundMsg.innerHTML = '<p>The organisation with these details cannot be found</p>';
                var parent = document.querySelector('.contentWrapper');
                parent.appendChild(notFoundMsg);
                notFoundShowing = true;
            }

            if (orgDetailsShowing) {
                var orgDetailBox = document.getElementsByClassName('organisationBox')[0];
                orgDetailBox.remove();
                orgDetailsShowing = false;
            }

            if (branchRequestsShowing) {
                var allBranchRequests = document.getElementsByClassName('branchRequests');
                if (allBranchRequests.length > 0) {
                    allBranchRequests[0].remove();
                }
                branchRequestsShowing = false;
            }

            if (currBranchesShowing) {
                var totalCurrBranches = document.getElementsByClassName('currentBranches');
                if (totalCurrBranches.length > 0) {
                    totalCurrBranches[0].remove();
                }
                currBranchesShowing = false;
            }
        }

        var orgListContainers = document.querySelectorAll('.allOrgBoxes');
        console.log(orgListContainers); // Log the selected elements
        orgListContainers.forEach(function(orgListContainer) {
            console.log("Adding hidden class to:", orgListContainer); // Log each container before adding the class
            orgListContainer.classList.add('hidden');
        });
    };
    xhttp1.open("GET", "/orgDetails?orgName=" + inputedName.value + "&email=" + inputedEmail.value, true);
    xhttp1.send();
}

function fetchBranchRequests() {
    const inputedName = document.getElementById('orgName');
    const inputedEmail = document.getElementById('orgEmail');

    //get the branch requests
    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function () {
        //console.log("xhttp2 called");
        if (this.readyState == 4 && this.status == 200) {
            let requests = JSON.parse(this.responseText);

            //get the div of the branch requests
            var divBranchRequests = document.createElement('div');
            divBranchRequests.className = "branchRequests";

            //create the heading
            var branchRequestHeading = document.createElement('h2');
            branchRequestHeading.innerText = "Branch Requests";
            var line = document.createElement('hr');

            divBranchRequests.appendChild(branchRequestHeading);
            divBranchRequests.appendChild(line);

            //loop through all requests and create the elements
            requests.forEach(request => {
                var allRequestsBox = document.createElement('div');
                allRequestsBox.className = "allRequests";

                var nameAndButtons = document.createElement('div');
                nameAndButtons.className = "nameAndButtons";

                var name = document.createElement('p');
                name.innerText = request.branchName;

                var buttons = document.createElement('div');

                var accept = document.createElement('button');
                accept.onclick = function () { branchRequestAccept(request.branchName, accept, inputedName, inputedEmail); };
                accept.innerText = "Accept \u2713";
                accept.className = "accept";

                var reject = document.createElement('button');
                reject.onclick = function () { branchRequestReject(request.branchName, reject, inputedName, inputedEmail); };
                reject.innerText = "Reject \u2715";
                reject.className = "reject";

                //append the buttons to the buttons div
                buttons.appendChild(accept);
                buttons.appendChild(reject);

                var newLine = document.createElement('hr');

                //append everything to the main box
                nameAndButtons.appendChild(name);
                nameAndButtons.appendChild(buttons);

                allRequestsBox.appendChild(nameAndButtons);
                allRequestsBox.appendChild(newLine);

                divBranchRequests.appendChild(allRequestsBox);
            });

            //append everything to the branches div
            var branchesDiv = document.querySelector('.branches');
            branchesDiv.appendChild(divBranchRequests);
            branchRequestsShowing = true;
            //call the next function
            fetchCurrBranches();

        }
    };
    xhttp2.open("GET", "/orgBranchRequests?orgName=" + inputedName.value + "&email=" + inputedEmail.value, true);
    xhttp2.send();

}

function fetchCurrBranches() {
    const inputedName = document.getElementById('orgName');
    const inputedEmail = document.getElementById('orgEmail');
    //get the current branch
    var xhttp3 = new XMLHttpRequest();
    xhttp3.onreadystatechange = function () {
        //console.log("xhttp3 called");
        if (this.readyState == 4 && this.status == 200) {
            let branches = JSON.parse(this.responseText);

            //get the div of the branch requests
            var divCurrBranches = document.createElement('div');
            divCurrBranches.className = "currentBranches";

            // var divCurrBranches = document.querySelector('.currentBranches');

            //create the heading
            var currBranchHeading = document.createElement('h2');
            currBranchHeading.id = "currBranchHeading";
            currBranchHeading.innerText = "Current Branches";
            var line = document.createElement('hr');
            var allCurrentBranches = document.createElement('div');
            allCurrentBranches.className = "allCurrentBranches";

            divCurrBranches.appendChild(currBranchHeading);
            divCurrBranches.appendChild(line);

            //loop through all current branches and create the elements
            branches.forEach(branch => {
                var nameAndButton = document.createElement('div');
                nameAndButton.className = "nameAndButtons";

                var name = document.createElement('p');
                name.innerText = branch.branchName;

                var remove = document.createElement('button');
                remove.onclick = function () { branchRemove(branch.branchName, remove, inputedName, inputedEmail); };
                remove.innerText = "Remove";
                remove.className = "remove";

                var newLine = document.createElement('hr');

                //append everything to the main box
                nameAndButton.appendChild(name);
                nameAndButton.appendChild(remove);

                allCurrentBranches.appendChild(nameAndButton);
                allCurrentBranches.appendChild(newLine);


            });
            divCurrBranches.appendChild(allCurrentBranches);

            //append everything to the branches div
            var branchesDiv = document.querySelector('.branches');
            branchesDiv.appendChild(divCurrBranches);
            currBranchesShowing = true;
        }
    };
    xhttp3.open("GET", "/orgCurrentBranches?orgName=" + inputedName.value + "&email=" + inputedEmail.value, true);
    xhttp3.send();

}

function goToEditOrganisation(orgId) {
    const orgName = document.getElementById('orgName').value;
    const orgEmail = document.getElementById('orgEmail').value;
    //console.log(orgName + orgEmail);
    window.location.href = "AdminEditOrganisations.html?orgName=" + encodeURIComponent(orgName) + "&orgEmail=" + encodeURIComponent(orgEmail) + "&orgID=" + orgId;
}

function branchRequestAccept(branchName, button, orgName, orgEmail) {
    //console.log(branchName + "  " + orgName.value +  " " + orgEmail.value);
    //remove from branch requests
    var entireBranchRequest = button.parentElement.parentElement;
    var hrElement = entireBranchRequest.nextElementSibling;
    entireBranchRequest.remove();
    if (hrElement) {
        hrElement.remove();
    }

    //add to the current branches
    var newBranch = document.createElement('div');
    newBranch.className = 'nameAndButtons';
    newBranch.innerHTML = `<p>${branchName}</p> <button class="remove" onclick="branchRemove('${branchName}', this, '${orgName.value}', '${orgEmail.value}')">Remove</button>`;
    var newLine = document.createElement('hr');

    var parent = document.querySelector('.allCurrentBranches');
    parent.appendChild(newBranch);
    parent.appendChild(newLine);

    //also alter this branch to be accepted in the database
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log("added successfully!")
        }
    };
    xhttp.open("POST", "/instantiateBranch", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ branchName: branchName, orgName: orgName.value, orgEmail: orgEmail.value }));
}

function branchRequestReject(branchName, button, orgName, orgEmail) {
    //remove the branches
    var entireBranchRequest = button.parentElement.parentElement;
    var hrElement = entireBranchRequest.nextElementSibling;
    entireBranchRequest.remove();
    if (hrElement) {
        hrElement.remove();
    }

    //remove from database
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log("removed successfully!")
        }
    };
    xhttp.open("POST", "/removeBranch", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ branchName: branchName, orgName: orgName.value, orgEmail: orgEmail.value }));
}

function branchRemove(branchName, button, orgName, orgEmail) {
    //remove the branche
    var entireBranch = button.parentElement;
    var hrElement = entireBranch.nextElementSibling;
    entireBranch.remove();
    if (hrElement) {
        hrElement.remove();
    }

    //remove from database
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log("success");
        }
    };
    xhttp.open("POST", "/removeBranch", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ branchName: branchName, orgName: orgName.value, orgEmail: orgEmail.value }));
}