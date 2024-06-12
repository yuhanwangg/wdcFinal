document.addEventListener("DOMContentLoaded", function () {
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
            notFoundShowing: false,
            rsvpd: false,
            joinedOrg: false,
            branch: 0,
        },
        methods: {
            searchSpecificPost() {
                var xhttp1 = new XMLHttpRequest();
                xhttp1.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        const responseData = JSON.parse(this.responseText);
                        vueinst.result = responseData;
                        vueinst.branch = responseData.branchID;

                        vueinst.checkRSVP();
                        vueinst.checkOrg();
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
            RSVP() {
                var xhttp1 = new XMLHttpRequest();
                const urlParams = new URLSearchParams(window.location.search);
                const oppID = urlParams.get('id');
                xhttp1.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var searchQ = "/successRSVPD?id=";
                        searchQ += oppID;
                        window.location.href = searchQ;
                    } else if (this.status === 409) {
                        alert("You have already RSVP'd for this opportunity.");
                    } else if (this.status === 404) {
                        vueinst.notFoundShowing = true;
                    }
                };

                xhttp1.open("POST", "/addRSVP", true);
                xhttp1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhttp1.send(JSON.stringify({ oppID: oppID }));
            },
            joinOrg() {
                var xhttp1 = new XMLHttpRequest();
                xhttp1.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        vueinst.joinedOrg = true;
                    } else if (this.status === 409) {
                        alert("You have already joined this Organisation.");
                    } else if (this.status === 404) {
                        vueinst.notFoundShowing = true;
                    }
                };

                const branchID = vueinst.branch;

                xhttp1.open("POST", "/joinOrgBranch", true);
                xhttp1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhttp1.send(JSON.stringify({ branchID: branchID }));
            },
            unRSVP() {
                var xhttp1 = new XMLHttpRequest();
                xhttp1.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        vueinst.rsvpd = false;
                    } else if (this.status === 409) {
                        alert("You weren't RSVPd.");
                    } else if (this.status === 404) {
                        vueinst.notFoundShowing = true;
                    }
                };

                const urlParams = new URLSearchParams(window.location.search);
                const oppID = urlParams.get('id');

                xhttp1.open("POST", "/removeRSVP", true);
                xhttp1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhttp1.send(JSON.stringify({ oppID: oppID }));
            },
            leaveOrg() {
                var xhttp1 = new XMLHttpRequest();
                xhttp1.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log('binked');
                        vueinst.joinedOrg = false;
                    } else if (this.status === 409) {
                        alert("You weren't part of the Organisation.");
                    } else if (this.status === 404) {
                        vueinst.notFoundShowing = true;
                    }
                };

                const urlParams = new URLSearchParams(window.location.search);
                const oppID = urlParams.get('id');

                xhttp1.open("POST", "/unjoinOrgBranch", true);
                xhttp1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhttp1.send(JSON.stringify({ oppID: oppID }));
            },
            back() {
                window.history.back();
            },
            checkRSVP() {
                var xhttp1 = new XMLHttpRequest();
                xhttp1.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        const responseState = JSON.parse(this.responseText);
                        vueinst.rsvpd = responseState;
                    } else if (this.status === 404) {
                        vueinst.notFoundShowing = true;
                    }
                };
                var searchQ = "/checkRSVP?id=";
                const urlParams = new URLSearchParams(window.location.search);
                const oppID = urlParams.get('id');
                searchQ += oppID;

                xhttp1.open("GET", searchQ, true);
                xhttp1.send();
            },
            checkOrg() {
                var xhttp1 = new XMLHttpRequest();
                xhttp1.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        const responseState = JSON.parse(this.responseText);
                        vueinst.joinedOrg = responseState;
                    } else if (this.status === 404) {
                        vueinst.notFoundShowing = true;
                    }
                };
                var searchQ = "/checkOrg?id=";
                const branchID = vueinst.branch;
                searchQ += branchID;

                xhttp1.open("GET", searchQ, true);
                xhttp1.send();
            },
            searchPosts() {
                window.location.href = '/opportunities';
            }
        },
        mounted() {
            this.searchSpecificPost();
        }
    });
    window.RSVP = vueinst.RSVP;
    window.joinOrg = vueinst.joinOrg;
    window.back = vueinst.back;
});