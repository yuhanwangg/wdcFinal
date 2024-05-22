function goToEditOrganisation() {
    window.location.href="AdminEditOrganisations.html";
}


function branchRequestAccept(branchName, button) {
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
    newBranch.innerHTML = '<p>' +branchName + '</p><button class="remove" onclick="branchRemove(this)">Remove</button>';
    var newLine = document.createElement('hr');

    var parent = document.querySelector('.allCurrentBranches');
    parent.appendChild(newBranch);
    parent.appendChild(newLine);
}

function branchRequestReject(button) {
    //remove the branches
    var entireBranchRequest = button.parentElement.parentElement;
    var hrElement = entireBranchRequest.nextElementSibling;
    entireBranchRequest.remove();
    if (hrElement) {
        hrElement.remove();
    }
}

function branchRemove(button) {
    //remove the branche
    var entireBranch = button.parentElement;
    var hrElement = entireBranch.nextElementSibling;
    entireBranch.remove();
    if (hrElement) {
        hrElement.remove();
    }
}
