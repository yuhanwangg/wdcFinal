
document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app',
    });
});

function registerBranch(event) {
    event.preventDefault();
    let name = document.getElementById("branchNameInput").value;
    let subInput = document.getElementById("suburbInput").value;
    let stateInput = document.getElementById("stateInput").value;
    let postcodeInput = document.getElementById("postcodeInput").value;
    let countryInput = document.getElementById("countryInput").value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // show success message through another funciton
            console.log("successfully registered");
            // display the success message
            showSuccessMsg();
        } else if (this.status == 500) {
            console.log("error in registering");
        }
    };

    xhttp.open("POST", "/regBranch", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ name: name, suburb: subInput, state: stateInput, postcode: postcodeInput, country: countryInput }));
}

function showSuccessMsg() {
    let successMsg = document.getElementById('successMsg');
    successMsg.classList.add('show');
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 5000);
}