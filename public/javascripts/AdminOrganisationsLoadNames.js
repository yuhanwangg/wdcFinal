/* global Vue */
document.addEventListener('DOMContentLoaded', function () {
    // function goToEditUser(userID) {
    //     window.location.href = "AdminEditUsers.html?userID=" + userID;
    // }

    // Initialize Vue instance after the DOM is fully loaded
    const vueinst = new Vue({
        el: "#app",
        data: {
            notFoundShowingVue: false,
            orgDetailsShowingVue: false,
            searchedForOrgVue: false,
            allOrgs: [],
            numOrgs: 0,
            numPages: 1,
            currPage: 1,
            sliceStart: 0,
            sliceEnd: 6
        },
        methods: {
            searchOrg() {
                vueinst.searchedForOrgVue = true;
                vueinst.orgDetailsShowingVue = true;
                vueinst.notFoundShowingVue = true;
            },

            nextPage() {
                vueinst.currPage++;
                //currentPageNumber++;
                // Calculate the start and end index of posts to display
                var startIndex = (vueinst.currPage - 1) * 6;
                var endIndex = vueinst.currPage * 6;

                //show only the next 4
                vueinst.sliceStart = startIndex;
                vueinst.sliceEnd = endIndex;

                // Hide or show the Next and previous Page button based on whether there are more posts to display
                var nextPageButton = document.querySelector('.next');
                var previousPageButton = document.querySelector('.previous');
                //console.log("the endIndex is " + endIndex + " the post length is " + vueinst.numPosts);
                if (endIndex >= vueinst.numOrgs) {
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



                // Hide the user selector box if it's not the first page
                var searchBar = document.querySelector('.searchBar');
                if (vueinst.currPage !== 0) {
                    searchBar.classList.add('hidden');
                } else {
                    searchBar.classList.remove('hidden');
                }

            },

            backPage() {
                //ensure that you don't go back to a non-existant page
                if (vueinst.currPage > 0) {
                    vueinst.currPage--;

                    //currentPageNumber++;
                    // Calculate the start and end index of posts to display
                    var startIndex = (vueinst.currPage - 1) * 6;
                    var endIndex = vueinst.currPage * 6;

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
                    else if (endIndex < vueinst.numOrgs) {
                        previousPageButton.style.display = 'block';
                        nextPageButton.style.display = 'block';
                    }


                    // Hide the search bar selector box if it's not the first page
                    var searchBar = document.querySelector('.searchBar');
                    //console.log("IN THE BACK PAGE: currPage is " + vueinst.currPage);
                    if (vueinst.currPage !== 1) {
                        searchBar.classList.add('hidden');
                    } else {
                        searchBar.classList.remove('hidden');
                    }
                }
            }
        }
    });

    function getAllOrgNames() {
        var xhttp1 = new XMLHttpRequest();
        xhttp1.onreadystatechange = function () {
            //console.log("xhttp1 called");
            if (this.readyState == 4 && this.status == 200) {
                //set the vue value userInfo to be the JSON
                //console.log(JSON.parse(this.responseText));
                //set the vue value to have the JSON array of posts, reverse it so that the most recent (id > value) is at the front
                vueinst.allOrgs = JSON.parse(this.responseText).reverse();
                console.log("VALUES BEING PASSED ARE:");
                vueinst.allOrgs.forEach(function(org) {
                    console.log(org);
                });

                vueinst.numOrgs = vueinst.allOrgs.length;
                vueinst.numPages = Math.ceil(vueinst.numOrgs / 6);
                if (vueinst.numPages === 0) {
                    vueinst.numPages = 1;
                }

                //if there are more than 6 users, display the next page button
                console.log("THE NUMBER OF ORGS LENGTH IS " + vueinst.numOrgs);

                if (vueinst.allOrgs.length > 6) {
                    var nextPageButton1 = document.querySelector('.next');
                    nextPageButton1.style.display = 'block';
                }

                // Hide or show the Next and previous Page button based on whether there are more posts to display
                var startIndex = (vueinst.currPage - 1) * 6;
                var endIndex = vueinst.currPage * 6;
                console.log("THE ENDINDEX IS " + endIndex);
                console.log("THE STARTINDEX IS " + startIndex);
                var nextPageButton = document.querySelector('.next');
                var previousPageButton = document.querySelector('.previous');
                //console.log("the endIndex is " + endIndex + " the post length is " + vueinst.numPosts);
                if (endIndex >= vueinst.numOrgs) {
                    nextPageButton.style.display = 'none';
                    previousPageButton.style.display = 'none';
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
        xhttp1.open("GET", "/allOrgs", true);
        xhttp1.send();
    }

    // Attach the findUser function to the window so it can be called from HTML
    window.getAllOrgNames = getAllOrgNames;
});