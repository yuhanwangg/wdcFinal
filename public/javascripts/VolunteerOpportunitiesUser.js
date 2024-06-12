document.addEventListener("DOMContentLoaded", function () {
    const vueinst = new Vue({
        el: '#app',
        data: {
            results: []
        },
        mounted() {
            fetch(`/allOpportunities`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('network error')
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('received all opportunities')
                    this.results = data;
                })
                .catch(error => {
                    console.error("error in getting all opportunities")
                })
        },
        methods: {
            generateLink(post) {
                // Customize this function to generate the link based on the post data
                return `/MoreInformationOpportunity?id=${post.oppID}`;
            },
            searchPosts() {
                const searchCategory = document.getElementById('categories').value;
                const searchCommitment = document.getElementById('commitment').value;
                const searchLocation = document.getElementById('location').value;

                var xhttp1 = new XMLHttpRequest();
                xhttp1.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        vueinst.results = JSON.parse(this.responseText);
                    } else if (this.status === 404) {
                        vueinst.notFoundShowing = true;
                    }
                };

                var searchQ = "/searchPosts";
                var params = [];

                if (searchCategory) {
                    params.push("categories=" + encodeURIComponent(searchCategory));
                }
                if (searchCommitment) {
                    params.push("commitment=" + encodeURIComponent(searchCommitment));
                }
                if (searchLocation) {
                    params.push("location=" + encodeURIComponent(searchLocation));
                }

                if (params.length > 0) {
                    searchQ += "?" + params.join("&");
                }

                console.log(searchQ);

                xhttp1.open("GET", searchQ, true);
                console.log("bing");
                xhttp1.send();
            },
            getAllOpportunities() {
                fetch('/allOpportunities')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('network error')
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('received all opportunities')
                        this.results = data;
                    })
                    .catch(error => {
                        console.error("error in getting all opportunities")
                    })
            }
        },
    });
});