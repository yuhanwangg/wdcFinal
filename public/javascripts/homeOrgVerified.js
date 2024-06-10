document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app',
        data: {
            orgName: '',
            branches: [],
            selectedBranchName: null,
            selectedBranchID: 0,
            branchPosts: [],
            branchUpdates: []
        },
        mounted() {
            fetch('/getName')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    this.orgName = data.name;
                })
                .catch(error => {
                    console.error('error fetching user name:', error);
                });
            fetch('/getBranches')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.length > 0) {
                        this.branches = data;
                        this.selectedBranchName = this.branches[0].branchName;
                        this.selectedBranchID = this.branches[0].branchID;
                        this.fetchBranchUpdates(this.selectedBranchID);
                        this.fetchBranchPosts(this.selectedBranchID);
                    }
                })
                .catch(error => {
                    console.error('error fetching branches:', error);
                });
        },
        methods: {
            chooseBranch(event) {
                this.selectedBranchID = event.target.value;
                console.log("branch id is: ", this.selectedBranchID);
                // Fetch updates for the selected branch
                this.fetchBranchUpdates(this.selectedBranchID);
                this.fetchBranchPosts(this.selectedBranchID);
            },
            formatDate(dateString) {
                // Parse the date string into a JavaScript Date object
                const date = new Date(dateString);
                // Check if the date is valid
                if (!isNaN(date.getTime())) {
                    // Format the date as desired (e.g., 'MM/DD/YYYY')
                    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                    return formattedDate;
                } else {
                    // Handle invalid date
                    return 'Invalid Date';
                }
            },
            fetchBranchUpdates(branchID) {
                fetch(`/getUpdates?branchID=${branchID}`) // Assuming there's an endpoint to fetch updates for a branch
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Update branchUpdates with fetched updates
                        console.log("we have updates!");
                        this.branchUpdates = data;
                    })
                    .catch(error => {
                        console.error('error fetching branch updates:', error);
                    });
            },
            fetchBranchPosts(branchID) {
                fetch(`/getPosts?branchID=${branchID}`) // Assuming there's an endpoint to fetch updates for a branch
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Update branchUpdates with fetched updates
                        console.log("we have posts!");
                        this.branchPosts = data;
                    })
                    .catch(error => {
                        console.error('error fetching branch posts:', error);
                    });
            },
            goTo(windowLocation) {
                window.location.href = windowLocation;
            }
        }
    });
});