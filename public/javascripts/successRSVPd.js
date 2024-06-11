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
                window.location.href = '/opportunities';
            },
        },
        mounted() {
            this.searchUser();
        }
    });
    window.browse = vueinst.browse;
});