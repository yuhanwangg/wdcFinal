document.addEventListener("DOMContentLoaded", function () {
    const vueinst = new Vue({
        el: '#app',
        data: {
            results: [],
            savedResults: [],
            currentPage: 1,
            pageSize: 1, // Number of results per page
            branches: [],
        },
        computed: {
            totalResults() {
                return this.savedResults.length;
            },
            totalPages() {
                return Math.ceil(this.totalResults / this.pageSize);
            },
            paginatedResults() {
                const start = (this.currentPage - 1) * this.pageSize;
                const end = start + this.pageSize;
                return this.savedResults.slice(start, end);
            },
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
                return `/MoreInformationOpportunityUser.html?id=${post.oppID}`;
            }
        },
        watch: {
            savedResults() {
                this.currentPage = 1; // Reset to first page on new results
                this.updatePaginatedResults(); // Update the paginated results
            },
            currentPage() {
                this.updatePaginatedResults(); // Update the paginated results when the page changes
            }
        }
    });

    function searchPosts() {
        const searchCategory = document.getElementById('categories').value;
        const searchCommitment = document.getElementById('commitment').value;
        const searchLocation = document.getElementById('location').value;

        var xhttp1 = new XMLHttpRequest();
        xhttp1.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                vueinst.savedResults = JSON.parse(this.responseText);
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

    window.searchPosts = searchPosts;
});