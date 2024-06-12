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
            notFoundShowing: false,
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
            login() {
                window.location.href = '/login';
            },
            back() {
                window.history.back();
            },
            searchPosts() {
                window.location.href = '/opportunities';
            }
        },
        mounted() {
            this.searchSpecificPost();
        }
    });

    window.searchSpecificPost = vueinst.searchSpecificPost;
    window.login = vueinst.login;
    window.back = vueinst.back;
});