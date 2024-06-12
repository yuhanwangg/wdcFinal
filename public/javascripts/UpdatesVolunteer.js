/*global Vue*/
//
function getFollowedBranch() {
    // get user id from route and then search for all followed branches
    fetch('/getFollowedBranch')
        .then(response => response.json())
        .then(data => {
            vueinst.branches = data;
            if (vueinst.branches.length > 0) {
                vueinst.selectedBranchName = vueinst.branches[0].branchName;
                vueinst.selectedBranchID = vueinst.branches[0].branchID;
                getPosts();
            }
        })
        .catch(error => console.error('Error fetching followed branches:', error));
}

//using session tokens
function getOrgName() {
    console.log("THE SELECTED BRANCH ID LOOOOOOOK HEERRRRRRREEEEE IS :  " + vueinst.selectedBranchID);
    var xhttp1 = new XMLHttpRequest();
    xhttp1.onreadystatechange = function () {
        //console.log("xhttp1 called");
        if (this.readyState == 4 && this.status == 200) {
            //set the vue value userInfo to be the JSON
            console.log("RETUNRED THE ORGNAME " + JSON.parse(this.responseText).orgName);
            vueinst.orgName = JSON.parse(this.responseText).orgName;

            console.log("FINAL THE ORGNAME " + vueinst.orgName);
        } else if (this.status === 404) {
            //console.log("went into 404 else statement, couldn't find the org's name");
        }
    };
    xhttp1.open("GET", "/getOrgNameVolunteers?selectedBranchID=" + vueinst.selectedBranchID, true);
    xhttp1.send();
}

function getOrgLogo() {
    var xhttp1 = new XMLHttpRequest();
    xhttp1.onreadystatechange = function () {
        //console.log("xhttp1 called");
        if (this.readyState == 4 && this.status == 200) {
            //set the vue value userInfo to be the JSON
            console.log("RETURNED THE LOGO PATH " + JSON.parse(this.responseText).imgPath);
            vueinst.logoPath = JSON.parse(this.responseText).imgPath;
            //console.log("The logopath is assigned to be ", vueinst.logoPath);

        } else if (this.status === 404) {
            //console.log("went into 404 else statement, couldn't find the org's name");
        }
    };
    xhttp1.open("GET", "/getOrgLogo", true);
    xhttp1.send();
}

function getPosts() {
    //get the user details
    var xhttp1 = new XMLHttpRequest();
    xhttp1.onreadystatechange = function () {
        //console.log("xhttp1 called");
        if (this.readyState == 4 && this.status == 200) {
            //set the vue value userInfo to be the JSON
            console.log("RETUNRED THE OLD POSTS " + JSON.parse(this.responseText));
            //set the vue value to have the JSON array of posts, reverse it so that the most recent (id > value) is at the front
            vueinst.oldPosts = JSON.parse(this.responseText).reverse();

            vueinst.numPosts = vueinst.oldPosts.length;
            vueinst.numPages = Math.ceil(vueinst.numPosts / 4);
            if (vueinst.numPages === 0) {
                vueinst.numPages = 1;
            }

            //if there are more than 4 posts, display the next page button
            if (vueinst.oldPosts.length > 4) {
                var nextPageButton1 = document.querySelector('.next');
                nextPageButton1.style.display = 'block';
            }

            // Hide or show the Next and previous Page button based on whether there are more posts to display
            var startIndex = (vueinst.currPage - 1) * 4;
            var endIndex = vueinst.currPage * 4;
            var nextPageButton = document.querySelector('.next');
            var previousPageButton = document.querySelector('.previous');
            //console.log("the endIndex is " + endIndex + " the post length is " + vueinst.numPosts);
            if (endIndex >= vueinst.numPosts) {
                nextPageButton.style.display = 'none';
                if (startIndex != 0) {
                    previousPageButton.style.display = 'block';
                }
            } else {
                nextPageButton.style.display = 'block';
                if (startIndex != 0) {
                    previousPageButton.style.display = 'block';
                }
            }
            getOrgName();

        } else if (this.status === 404) {
            //console.log("went into 404 else statement, couldn't find the branch");
        }

        else {
            //console.log ("failed");
        }
    };
    xhttp1.open("GET", "/getPostsVolunteer?branchID=" + vueinst.selectedBranchID, true);
    xhttp1.send();
}
let vueinst;
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Vue instance after the DOM is fully loaded
    vueinst = new Vue({
        el: "#app",
        data: {
            orgName: '',
            branches: [],
            oldPosts: [],
            selectedBranchName: null,
            selectedBranchID: 0,
            numPosts: 0,
            currPage: 1,
            numPages: 1,
            sliceStart: 0,
            sliceEnd: 4
        },
        methods: {
            choseBranch(event) {
                this.selectedBranchID = event.target.value;
                //console.log("the selected branch is" + vueinst.selectedBranchID);
                // //console.log("in the methods, the selected branch name is " + this.selectedBranchName);
                getPosts();
            },

            nextPage() {
                vueinst.currPage++;
                //currentPageNumber++;
                // Calculate the start and end index of posts to display
                var startIndex = (vueinst.currPage - 1) * 4;
                var endIndex = vueinst.currPage * 4;

                //show only the next 4
                vueinst.sliceStart = startIndex;
                vueinst.sliceEnd = endIndex;

                // Hide or show the Next and previous Page button based on whether there are more posts to display
                var nextPageButton = document.querySelector('.next');
                var previousPageButton = document.querySelector('.previous');
                //console.log("the endIndex is " + endIndex + " the post length is " + vueinst.numPosts);
                if (endIndex >= vueinst.numPosts) {
                    nextPageButton.style.display = 'none';
                    if (startIndex != 0) {
                        previousPageButton.style.display = 'block';
                    }
                } else {
                    nextPageButton.style.display = 'block';
                    if (startIndex != 0) {
                        previousPageButton.style.display = 'block';
                    }
                }


                // Hide the branch selector box if it's not the first page
                var branchSelector = document.querySelector('.dropdown');
                if (vueinst.currPage !== 0) {
                    branchSelector.classList.add('hidden');
                } else {
                    branchSelector.classList.remove('hidden');
                }

            },

            backPage() {
                //ensure that you don't go back to a non-existant page
                if (vueinst.currPage > 0) {
                    vueinst.currPage--;

                    //currentPageNumber++;
                    // Calculate the start and end index of posts to display
                    var startIndex = (vueinst.currPage - 1) * 4;
                    var endIndex = vueinst.currPage * 4;

                    //show only the next 4
                    vueinst.sliceStart = startIndex;
                    vueinst.sliceEnd = endIndex;

                    // Hide or show the Next and previous Page buttons based on whether there are more posts to display
                    var nextPageButton = document.querySelector('.next');
                    var previousPageButton = document.querySelector('.previous');
                    if (startIndex === 0) {
                        previousPageButton.style.display = 'none';
                        nextPageButton.style.display = 'block';
                    }
                    else if (endIndex < vueinst.numPosts) {
                        previousPageButton.style.display = 'block';
                        nextPageButton.style.display = 'block';
                    }


                    // Hide the branch selector box if it's not the first page
                    var branchSelector = document.querySelector('.dropdown');
                    //console.log("IN THE BACK PAGE: currPage is " + vueinst.currPage);
                    if (vueinst.currPage !== 1) {
                        branchSelector.classList.add('hidden');
                    } else {
                        branchSelector.classList.remove('hidden');
                    }
                }
            }
        }
    });

    getFollowedBranch();
    getPosts();

});