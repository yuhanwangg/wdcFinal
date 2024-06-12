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
                // Update the Vue instance's savedResults property
                // Update the Vue instance's savedResults property
                vueinst.savedResults = JSON.parse(this.responseText);
            } else if (this.status === 404) {
                console.log("THERE ARE NO POSTS TO SHOW");
                vueinst.savedResults = []; // Clear savedResults if no posts found
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
                    vueinst.savedResults = data;
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
            savedResults: [],
            currentPage: 1,
            pageSize: 6, // Number of results per page
            branches: [],
            numPosts: 0,
            selectedBranch: -1
        },
        computed: {
            totalResults() {
                return this.savedResults.length;
            },
            totalPages() {
                var pageNum = Math.ceil(this.totalResults / this.pageSize);
                if (pageNum === 0) {
                    pageNum = 1;
                }
                return pageNum;
            },
            paginatedResults() {
                const start = (this.currentPage - 1) * this.pageSize;
                const end = start + this.pageSize;
                return this.savedResults.slice(start, end);
            },
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
            nextPage() {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                }
            },
            prevPage() {
                if (this.currentPage > 1) {
                    this.currentPage--;
                }
            },
            updatePaginatedResults() {
                this.results = this.paginatedResults;
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
            }
        },
        watch: {
            branches(newBranches) {
                console.log("branches updated:", newBranches); // Add this line for debugging
                if (newBranches.length > 0) {
                    this.selectedBranch = newBranches[0];
                    showPosts();
                }
            },
            savedResults(newSavedResults) {
                console.log("savedResults updated:", newSavedResults); // Add this line for debugging
                this.currentPage = 1; // Reset to first page on new results
                this.updatePaginatedResults(); // Update the paginated results
            },
            currentPage() {
                this.updatePaginatedResults(); // Update the paginated results when the page changes
            },
        },
        mounted() {
            this.findBranches();
        }
    });
});
