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
            fetch('/')
        },
        methods: {
            chooseBranch(event) {
                this.selectedBranchID = event.target.value;
                console.log("branch id is: ", this.selectedBranchID);
                // Fetch updates for the selected branch
                this.fetchBranchUpdates(this.selectedBranchID);
                this.fetchBranchPosts(this.selectedBranchID);
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