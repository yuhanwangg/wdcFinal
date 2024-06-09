/*global Vue*/

// let sessionToken = req.session.userType;
//     if (sessionToken == null) {
//         res.sendFile(path.join(__dirname, '..', 'public', 'homeGuest.html'));
//     } else if (sessionToken === "volunteer") {
//         res.sendFile(path.join(__dirname, '..', 'public', 'homeVolunteer.html'));
//     } else if (sessionToken === "organisation") {

//using session tokens
function getOrgName() {
    var xhttp1 = new XMLHttpRequest();
    xhttp1.onreadystatechange = function () {
        //console.log("xhttp1 called");
        if (this.readyState == 4 && this.status == 200) {
            //set the vue value userInfo to be the JSON
            console.log("RETUNRED THE ORGNAME " + JSON.parse(this.responseText).orgName);
            vueinst.orgName = JSON.parse(this.responseText).orgName;

        } else if (this.status === 404) {
            //console.log("went into 404 else statement, couldn't find the org's name");
        }
    };
    xhttp1.open("GET", "/getOrgName", true);
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

function getBranches() {
    //console.log("WE ARE RIGHT HERE!!! went into get branches function");

    //get the user details
    var xhttp1 = new XMLHttpRequest();
    xhttp1.onreadystatechange = function () {
        //console.log("xhttp1 called");
        if (this.readyState == 4 && this.status == 200) {
            //set the vue value userInfo to be the JSON
            console.log("RETUNRED THE BRANCHES " + JSON.parse(this.responseText));
            vueinst.branches = JSON.parse(this.responseText);

            if (vueinst.branches.length > 0) {
                vueinst.selectedBranchName = vueinst.branches[0].branchName;
                vueinst.selectedBranchID = vueinst.branches[0].branchID;
                //console.log("BOUT TO GET POSTS");
                getPosts();
            }

        } else if (this.status === 404) {
            //console.log("went into 404 else statement, couldn't find the org's branches");
        }
    };
    xhttp1.open("GET", "/getBranches", true);
    xhttp1.send();
}

function getPosts() {

    //console.log("WE ARE RIGHT HERE!!! went into get Posts function");
    // //console.log("the selected branch is" + vueinst.selectedBranchName);

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

        } else if (this.status === 404) {
            //console.log("went into 404 else statement, couldn't find the branch");
        }

        else {
            //console.log ("failed");
        }
    };
    xhttp1.open("GET", "/oldPosts?branchID=" + vueinst.selectedBranchID, true);
    xhttp1.send();
}

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Vue instance after the DOM is fully loaded
    window.vueinst = new Vue({
        el: "#app",
        data: {
            orgName: '',
            logoPath: null,
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
                // //console.log("in the methods, the selected branch name is " + this.selectedBranchName);
                getPosts();
            },

            post() {

                var updateTitleInput = document.querySelector('.newPost input[type="text"]').value;
                var updateMessageInput = document.querySelector('.newPost textarea').value;

                var currentDate = new Date();
                // Format the date and time as desired (e.g., "May 9, 2024 10:30 AM")
                var formattedDate = currentDate.toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });

                var xhttp1 = new XMLHttpRequest();
                xhttp1.onreadystatechange = function () {
                    //console.log("xhttp1 called");
                    if (this.readyState == 4 && this.status == 200) {
                        //set the vue value userInfo to be the JSON
                        //console.log(JSON.parse(this.responseText));
                        //set the vue value to have the JSON array of posts, reverse it so that the most recent (id > value) is at the front
                        vueinst.oldPosts = JSON.parse(this.responseText).reverse();

                        vueinst.numPosts = vueinst.oldPosts.length;
                        vueinst.numPages = Math.ceil(vueinst.numPosts / 4);
                        if (vueinst.numPages === 0) {
                            vueinst.numPages = 1;
                        }

                        var allPosts = document.querySelectorAll('.oldPosts');
                        // Calculate the start and end index of posts to display
                        var startIndex = (vueinst.currPage - 1) * 4;
                        var endIndex = vueinst.currPage * 4;

                        //if there are more than 4 posts, display the next page button
                        //console.log("There are " + vueinst.oldPosts.length)
                        if (vueinst.oldPosts.length > 4) {
                            var nextPageButton = document.querySelector('.next');
                            nextPageButton.style.display = 'block';
                        }

                    } else if (this.status === 404) {
                        //console.log("went into 404 else statement, couldn't find the branch");
                    }

                    else {
                        //console.log ("failed");
                    }
                };

                xhttp1.open("POST", "/createNewPost");
                // //console.log("THE VALUES PARSED TO CREATE A NEW POST ARE " + vueinst.selectedBranchName + " " + orgID + " " + updateTitleInput + " " + updateMessageInput + " " + formattedDate);
                xhttp1.setRequestHeader("Content-type", "application/json");
                xhttp1.send(JSON.stringify({ branchID: vueinst.selectedBranchID, updateName: updateTitleInput, updateMsg: updateMessageInput, dateCreated: formattedDate }));


                //send the new post to all users following the branch
                var xhttp2 = new XMLHttpRequest();
                var text = vueinst.orgName + " " + vueinst.selectedBranchName + " has posted the new update below: <br><br>" + "<b>Title: " + updateTitleInput + "</b><br><br>Message: " + updateMessageInput + "<br><br>Kind regards, <br><br>Heartfelt Helpers";
                var subject = "New Update from " + vueinst.orgName + " " + vueinst.selectedBranchName;
                xhttp2.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        // console.log("emailed successfully!")
                    }
                };
                xhttp2.open("POST", "/emailUpdate", true);
                xhttp2.setRequestHeader("Content-type", "application/json");
                xhttp2.send(JSON.stringify({ branchID: vueinst.selectedBranchID, subject: subject, text: text }));
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



                // Hide the "New Post" and the branch selector box if it's not the first page
                var newPostBox = document.querySelector('.newPost');
                var newPostTitle = document.querySelector('h2');
                var branchSelector = document.querySelector('.dropdown');
                if (vueinst.currPage !== 0) {
                    newPostBox.classList.add('hidden');
                    newPostTitle.classList.add('hidden');
                    branchSelector.classList.add('hidden');
                } else {
                    newPostBox.classList.remove('hidden');
                    newPostTitle.classList.remove('hidden');
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



                    // Hide the "New Post" and the branch selector box if it's not the first page
                    var newPostBox = document.querySelector('.newPost');
                    var newPostTitle = document.querySelector('h2');
                    var branchSelector = document.querySelector('.dropdown');
                    //console.log("IN THE BACK PAGE: currPage is " + vueinst.currPage);
                    if (vueinst.currPage !== 1) {
                        newPostBox.classList.add('hidden');
                        newPostTitle.classList.add('hidden');
                        branchSelector.classList.add('hidden');
                    } else {
                        newPostBox.classList.remove('hidden');
                        newPostTitle.classList.remove('hidden');
                        branchSelector.classList.remove('hidden');
                    }
                }
            }
        }
    });

    // window.getOrgName = getOrgName;
    // window.getBranches = getBranches;
    // window.getPosts = getPosts;
    // window.getOrgLogo = getOrgLogo;
    getOrgName();
    getBranches();
    getPosts();
    getOrgLogo();

    const descTextarea = document.getElementById('postMessage');
    const descCount = document.querySelector('.descCount');
    const max = 750;


    function updateCharacterCount() {
        const remaining = max - descTextarea.value.length;
        descCount.textContent = remaining;
    }

    updateCharacterCount();

    descTextarea.onkeyup = updateCharacterCount;
});