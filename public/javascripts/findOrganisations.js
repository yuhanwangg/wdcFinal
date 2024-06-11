document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app',
        data: {
            searchResults: [],
            numPosts: 0,
            currPage: 1,
            numPages: 1,
            sliceState: 0,
            sliceEnd: 5,
            userType: null
        },
        mounted() {
            // load all opportunities
            this.search();
            this.checkUserType();
        },
        methods: {
            // handle search
            search() {
                let locationInput = document.getElementById("locationSearch").value;
                let nameInput = document.getElementById("nameSearch").value;

                fetch('/searchOrgs', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        location: locationInput,
                        name: nameInput
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("network error");
                        }
                        return response.json(); // Parse the response as JSON
                    })
                    .then(data => {
                        console.log("getting organisations of search");
                        this.searchResults = data; // Assign the parsed data to searchResults
                    })
                    .catch(error => {
                        console.error("error in getting organisations", error);
                    });
            },
            // joining organisation when click button
            joinOrganisation(brID) {
                console.log(" joining branch: " + brID)
                // request user ID and add volunteer to following a branch
                fetch('/joinOrgBranch', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        branchID: brID,
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("network error");
                        }
                        console.log("we've joined!")
                        let org = this.searchResults.find(org => org.branchID === brID);
                        if (org) {
                            org.joined = true;
                        }
                    })
                    .catch(error => {
                        console.error("error in joining organisation", error);
                    });
            },
            unjoinOrganisation(brID) {
                console.log(" unjoining branch: " + brID)
                fetch('/unjoinOrgBranch', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        branchID: brID,
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("network error");
                        }
                        console.log("we've unjoined!")
                        let org = this.searchResults.find(org => org.branchID === brID);
                        if (org) {
                            org.joined = false;
                        }
                    })
                    .catch(error => {
                        console.error("error in unjoining organisation", error);
                    });
            },
            checkUserType() {
                fetch('/sessionUserType')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("cannot get session type");
                        }
                        return response.json(); // Parse the response as JSON
                    })
                    .then(data => {
                        this.userType = data.userType; // Access userType from the parsed JSON data
                        console.log("user: ", this.userType);
                    })
                    .catch(error => {
                        console.error("cannot receive session type");
                    })
            },
            // next page implementation

            // previous page implementation
        }
    });
});