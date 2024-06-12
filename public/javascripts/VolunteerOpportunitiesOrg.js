document.addEventListener("DOMContentLoaded", function () {
    function showPosts() {
        console.log("showPosts called");  // Add this line for debugging
        const searchCategory = document.getElementById('categories').value;
        const searchCommitment = document.getElementById('commitment').value;
        const searchLocation = document.getElementById('location').value;

        var xhttp1 = new XMLHttpRequest();
        xhttp1.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Response:", this.responseText); // Add this line for debugging
                // Update the Vue instance's results property
                // Update the Vue instance's results property
                vueinst.results = JSON.parse(this.responseText);
            } else if (this.status === 404) {
                console.log("THERE ARE NO POSTS TO SHOW");
                vueinst.results = []; // Clear results if no posts found
                vueinst.numPosts = 0;
                vueinst.notFoundShowing = true;
            }
        };

        var searchQ = "/showPosts";
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

        if (vueinst.selectedBranch.branchID !== 'undefined') {
            params.push("branchID=" + vueinst.selectedBranch.branchID);
        } else if (vueinst.selectedBranch.branchID === -1 || vueinst.selectedBranch.branchID === 'undefined') {
            // show only posts from branch rather than any else
            fetch('/allOpportunities')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('network error')
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('received all opportunities')
                    vueinst.results = data;
                })
                .catch(error => {
                    console.error("error in getting all opportunities")
                })
        }

        if (params.length > 0) {
            searchQ += "?" + params.join("&");
        }

        console.log("Request URL:", searchQ); // Add this line for debugging
        xhttp1.open("GET", searchQ, true);
        xhttp1.send();
    }

    window.showPosts = showPosts;

    const vueinst = new Vue({
        el: '#app',
        data: {
            results: [],
            branches: [],
            selectedBranch: -1
        },
        mounted() {
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
        },
        methods: {
            findBranches() {
                var xhttp1 = new XMLHttpRequest();
                xhttp1.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        vueinst.branches = JSON.parse(this.responseText);
                    } else if (this.status === 404) {
                        vueinst.notFoundShowing = true;
                    }
                };

                var searchQ = "/findBranches";

                xhttp1.open("GET", searchQ, true);
                xhttp1.send();
            },
            generateLink(post) {
                // Customize this function to generate the link based on the post data
                return `/MoreInformationOpportunity?id=${post.oppID}`;
            },
            choseBranch() {
                showPosts();
            },
            createPost() {
                window.location.href = '/CreateVolunteerOpportunity';
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
            }
        },
        watch: {
            branches(newBranches) {
                console.log("branches updated:", newBranches); // Add this line for debugging
                if (newBranches.length > 0) {
                    this.selectedBranch = newBranches[0];
                    showPosts();
                }
            }
        },
        mounted() {
            this.findBranches();
        }
    });
});