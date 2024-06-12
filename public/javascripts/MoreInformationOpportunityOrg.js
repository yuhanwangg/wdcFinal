document.addEventListener("DOMContentLoaded", async function () {
    Vue.component('leaflet-map', {
        template: `
            <div>
                <div ref="map" style="height: 400px;"></div>
            </div>
        `,
        data() {
            return {
                latitude: 0,
                longitude: 0,
                oppID: 0
            }
        },
        async mounted() {
            const urlParams = new URLSearchParams(window.location.search);
            this.oppID = urlParams.get('id');

            try {
                // get req to get the location of the opportunities to also convert into latitude and longitude
                const response = await fetch("/getCoords", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ oppID: this.oppID })
                });
                if (!response.ok) {
                    throw new Error("network response not good");
                }
                const data = await response.json();
                this.latitude = data.latitude;
                this.longitude = data.longitude;

                // Ensure Leaflet is initialized after the component is mounted
                this.initializeMap();
            } catch (error) {
                console.error("error fetching the coords for opportunity org", error);
            }
        },
        methods: {
            initializeMap() {
                this.$nextTick(() => {
                    // Initialize the map
                    this.map = L.map(this.$refs.map).setView([this.latitude, this.longitude], 13);

                    // Add OpenStreetMap tile layer
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(this.map);

                    console.log("coords: ", this.latitude, this.longitude)
                    L.marker([this.latitude, this.longitude]).addTo(this.map)
                        .bindPopup('Event location')
                        .openPopup();
                });
            }
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
                console.log("big number");
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
            },
            searchPosts() {
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
    window.back = vueinst.back;
});
