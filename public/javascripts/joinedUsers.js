document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app',
        data: {
            branches: [],
            selectedBranchName: null,
            selectedBranchID: 1,
            branchVolunteers: [],
            numVolunteers: 0
        },
        mounted() {
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
                        this.fetchBranchVolunteers(this.selectedBranchID);
                        this.getNumVolunteers(this.selectedBranchID);
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
                this.getNumVolunteers(this.selectedBranchID);
                this.fetchBranchVolunteers(this.selectedBranchID);
            },
            fetchBranchVolunteers(branchID) {
                console.log("branch id: ", branchID)
                // send fetch request for all users who follow the branch
                fetch(`/getBranchVolunteers?branchID=${branchID}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        this.branchVolunteers = data;
                        console.log("Branch volunteers:", this.branchVolunteers);
                    })
                    .catch(error => {
                        console.error('error fetching number of volunteers:', error);
                    });

            },
            getNumVolunteers(branchID) {
                fetch(`/getNumVolunteers?branchID=${branchID}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        this.numVolunteers = data.followerCount;
                        console.log("num of volunteers: ", this.numVolunteers);
                    })
                    .catch(error => {
                        console.error('error fetching number of volunteers:', error);
                    });
            },
            removeVolunteer(volunteerID) {
                console.log("we are removing the id: ", volunteerID)
                // post request
                let reqBody = {
                    userID: volunteerID,
                    branchID: this.selectedBranchID
                };
                console.log("branch id: ", this.selectedBranchID);
                console.log("user ID: ", volunteerID);

                fetch(`/removeVolunteer/${this.selectedBranchID}/${volunteerID}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userID: volunteerID })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        console.log('volunteer removed!');
                        // Update the UI after successful removal
                        this.branchVolunteers = this.branchVolunteers.filter(volunteer => volunteer.userID !== volunteerID);
                        // re-fetch the branch users
                        this.fetchBranchVolunteers(this.selectedBranchID);
                        this.getNumVolunteers(this.selectedBranchID);
                    })
                    .catch(error => {
                        console.error('error removing volunteer:', error);
                    });
            }
        }
    });
});