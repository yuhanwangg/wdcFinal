document.addEventListener("DOMContentLoaded", function () {
    Vue.component('leaflet-map', {
        template: `
            <div>
                <div ref="map" style="height: 400px;"></div>
            </div>
        `,
        mounted() {
            // Ensure Leaflet is initialized after the component is mounted
            this.$nextTick(() => {
                // Initialize the map
                this.map = L.map(this.$refs.map).setView([51.505, -0.09], 13);

                // Add OpenStreetMap tile layer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(this.map);

                // Add a marker
                L.marker([51.5, -0.09]).addTo(this.map)
                    .bindPopup('A marker on OpenStreetMap')
                    .openPopup();
            });
        }
    });


    const vueinst = new Vue({
        el: '#app',
        data: {
            result: [],
            users: [],
            notFoundShowing: false,
        },
        computed: {
            RSVPCount() {
                console.log("big numeer");
                return this.users.length;
            },
        },
        methods: {
            searchSpecificPost() {
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
                var searchQ = "/searchSpecificPost?id=";
                searchQ += paramValue;

                xhttp1.open("GET", searchQ, true);
                xhttp1.send();
            },
            searchUsers() {
                var xhttp1 = new XMLHttpRequest();
                xhttp1.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        vueinst.users = JSON.parse(this.responseText);
                    } else if (this.status === 404) {
                        vueinst.notFoundShowing = true;
                    }
                };

                const urlParams = new URLSearchParams(window.location.search);
                const paramValue = urlParams.get('id');
                var searchQ = "/searchUsers?id=";
                searchQ += paramValue;

                xhttp1.open("GET", searchQ, true);
                xhttp1.send();
            },
            removeUser(userID) {
                var xhttp1 = new XMLHttpRequest();
                xhttp1.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        vueinst.searchUsers();
                    } else if (this.status === 409) {
                        alert("You weren't RSVPd.");
                    } else if (this.status === 404) {
                        vueinst.notFoundShowing = true;
                    }
                };

                const urlParams = new URLSearchParams(window.location.search);
                const oppID = urlParams.get('id');

                xhttp1.open("POST", "/removeUserOrg", true);
                xhttp1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhttp1.send(JSON.stringify({ oppID: oppID, userID: userID }));
            },
            back() {
                window.location.href = '/opportunities';
            }
        },
        mounted() {
            this.searchSpecificPost();
            this.searchUsers();
        }
    });

    window.searchSpecificPost = vueinst.searchSpecificPost;
    window.searchUsers = vueinst.searchUsers;
    window.login = vueinst.login;
    window.back = vueinst.back;
});