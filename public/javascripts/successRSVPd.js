//
document.addEventListener("DOMContentLoaded", function () {
    const vueinst = new Vue({
        el: '#app',
        data: {
            result: [],
            notFoundShowing: false,
        },
        methods: {
            searchUser() {
                var xhttp1 = new XMLHttpRequest();
                xhttp1.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        vueinst.result = JSON.parse(this.responseText);
                    } else if (this.status === 404) {
                        vueinst.notFoundShowing = true;
                    }
                };

                const urlParams = new URLSearchParams(window.location.search);
                const paramValue = urlParams.get('id');
                var searchQ = "/findEmailName?id=";
                searchQ += paramValue;

                xhttp1.open("GET", searchQ, true);
                xhttp1.send();
            },
            browse() {
                const checkbox = document.getElementById('emailNotifications');

<<<<<<< HEAD
                    // Check if the checkbox is checked
                    const isChecked = checkbox.checked;

                    // Handle the value
                    if (isChecked) {
                        this.confirmationEmail();
                    }
=======
                // Check if the checkbox is checked
                const isChecked = checkbox.checked;

                // Handle the value
                if (isChecked) {
                    this.confirmationEmail();
                }
>>>>>>> 292938dd198412cf4de415d36602c5a76d9ae770
                window.location.href = '/opportunities';
            },
            confirmationEmail() {
                var xhttp1 = new XMLHttpRequest();
                const urlParams = new URLSearchParams(window.location.search);
                const oppID = urlParams.get('id');
                var subject = "RSVP Confirmation";
                var inside = "We are writing to say thank you for RSVPing with us."
                xhttp1.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                    } else if (this.status === 404) {
                        vueinst.notFoundShowing = true;
                    }
                };

                xhttp1.open("POST", "/emailConfirmation", true);
                xhttp1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhttp1.send(JSON.stringify({
                    subject: subject,
                    text: inside,
                    oppID: oppID,
                }));
            }
        },
        mounted() {
            this.searchUser();
        }
    });
    window.browse = vueinst.browse;
});
