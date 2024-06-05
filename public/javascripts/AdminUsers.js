/* global Vue */
document.addEventListener('DOMContentLoaded', function () {
    // function goToEditUser(userID) {
    //     window.location.href = "AdminEditUsers.html?userID=" + userID;
    // }

    // Initialize Vue instance after the DOM is fully loaded
    const vueinst = new Vue({
        el: "#app",
        data: {
            userInfo: [],
            notFoundShowing: false,
            userDetailsShowing: false,
            searchedForUser: false,
            notFoundMsg: "The user with these details cannot be found"
        },
        methods: {
            goToEditUser(userID) {
                window.location.href = "AdminEditUsers.html?userID=" + userID;
            }
        }
    });

    function findUser() {
        //have searched for user so set it to true
        vueinst.searchedForUser = true;

        ////console.log("WE ARE RIGHT HERE!!! went into find User function");
        const inputedFirstName = document.getElementById('firstNameInput');
        const inputedLastName = document.getElementById('lastNameInput');
        const inputedEmail = document.getElementById('emailInput');
        //console.log("inputted values are " + inputedFirstName.value + " " + inputedLastName.value + " " + inputedEmail.value);

        //get the user details
        var xhttp1 = new XMLHttpRequest();
        xhttp1.onreadystatechange = function () {
            //console.log("xhttp1 called");
            if (this.readyState == 4 && this.status == 200) {
                //set the vue value userInfo to be the JSON
                //console.log(JSON.parse(this.responseText));
                vueinst.userInfo = JSON.parse(this.responseText);

                //remove current info/error messages showing
                vueinst.notFoundShowing = false;
                vueinst.userDetailsShowing = true;
            } else if (this.status === 404) {
                //change vue value to show that we didn't find the user
                vueinst.notFoundShowing = true;
                vueinst.userDetailsShowing = false;

                //console.log("went into 404 else statement, the values of notFound and userShowing are: " +  vueinst.notFoundShowing +  " " + vueinst.userDetailsShowing);
            }
        };
        xhttp1.open("GET", "/userDetails?userFirstName=" + inputedFirstName.value + "&userLastName=" + inputedLastName.value + "&email=" + inputedEmail.value, true);
        xhttp1.send();
    }

    // Attach the findUser function to the window so it can be called from HTML
    window.findUser = findUser;
});