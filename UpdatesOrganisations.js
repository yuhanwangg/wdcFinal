var currentPageNumber = 0;

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

// function showBranchOptions() {
//     document.getElementById("myDropdown").classList.toggle("show");
// }

// Close the dropdown menu if the user clicks outside of it
// window.onclick = function(event) {
//     if (!event.target.matches('.dropbtn')) {
//         var dropdowns = document.getElementsByClassName("dropdown-content");
//         var i;
//         for (i = 0; i < dropdowns.length; i++) {
//         var openDropdown = dropdowns[i];
//         if (openDropdown.classList.contains('show')) {
//             openDropdown.classList.remove('show');
//         }
//         }
//     }
// }

// function chooseBranch(branch) {
//     var branchName = branch.textContent;
//     var dropDown = document.querySelector(".dropbtn");
//     dropDown.innerText = branchName + " ▼";
//     document.getElementById("myDropdown").classList.remove("show");
// }


function post() {

    var updateTitleInput = document.querySelector('.newPost input[type="text"]').value;
    var updateMessageInput = document.querySelector('.newPost textarea').value;

    var oldPostsContainer = document.querySelector('.allPosts');

    var newPost = document.createElement('div');
    newPost.className = 'oldPosts';
    var newPostContent = document.createElement('div');
    newPostContent.className = 'postInfo';

    var updateName = document.createElement('p');
    updateName.className = 'title';
    updateName.innerText = updateTitleInput;

    var extraDetailsText = document.createElement('div');
    extraDetailsText.className = 'extraDetails';

    var OrganisationName = document.createElement('p');
    OrganisationName.innerText = "Organiation Name";

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
    var postDate = document.createElement('p');
    postDate.innerText = formattedDate;

    extraDetailsText.appendChild(OrganisationName);
    extraDetailsText.appendChild(postDate);


    var updateInfo = document.createElement('p');
    updateInfo.innerText = updateMessageInput;


    newPostContent.appendChild(updateName);
    newPostContent.appendChild(extraDetailsText);
    newPostContent.appendChild(updateInfo);

    newPost.appendChild(newPostContent);
    var logo = document.createElement('img');
    logo.className = 'logo';
    logo.src = "exampleLogo.png";
    logo.alt = "Company logo";

    newPost.appendChild(logo);

    oldPostsContainer.insertBefore(newPost, oldPostsContainer.firstChild);

    // Convert NodeList to an array for easier manipulation
    var allPosts = document.querySelectorAll('.oldPosts');
    var postsArray = Array.from(allPosts);

    // Hide posts beyond the 4th index
    for (let i = 4; i < postsArray.length; i++) {
        postsArray[i].style.display = 'none';
    }

    //if there are more than 4 posts, display the next page button
    if (allPosts.length > 4) {
        var nextPageButton = document.querySelector('.next');
        nextPageButton.style.display = 'block';
    }

    //change the number of posts
    var postNumber = document.querySelector('#numPosts');
    postNumber.innerText = allPosts.length + " Posts";

    //change the page number
    var pageNumber = document.querySelector('#pageNum');
    pageNumber.innerText = "Page " + (currentPageNumber + 1) + "/" + Math.ceil(allPosts.length/4);
}

function nextPage() {
    currentPageNumber++;

    // Hide the "New Post" box if it's not the first page
    var newPostBox = document.querySelector('.newPost');
    var newPostTitle = document.querySelector('h2');
    if (currentPageNumber !== 0) {
        newPostBox.classList.add('hidden');
        newPostTitle.classList.add('hidden');
    } else {
        newPostBox.classList.remove('hidden');
        newPostTitle.classList.remove('hidden');

    }

    var allPosts = document.querySelectorAll('.oldPosts');
    var postsArray = Array.from(allPosts);

    //load in new updates from next page
    //postsarray will be from the SQL
    // var oldPosts = postsArray;
    //hide all posts that aren't on the page
    for (let i = 0; i < postsArray.length; i++) {
        postsArray[i].style.display = 'none';
    }

    // Calculate the start and end index of posts to display
    var startIndex = currentPageNumber * 4;
    var endIndex = (currentPageNumber + 1) * 4;

    // Display posts within the calculated range
    for (let i = startIndex; i < endIndex && i < allPosts.length; i++) {
        allPosts[i].style.display = 'block';
    }

    // Hide or show the Next Page button based on whether there are more posts to display
    var nextPageButton = document.querySelector('.next');
    var previousPageButon = document.querySelector('.previous');
    if (endIndex >= allPosts.length) {
        nextPageButton.style.display = 'none';
        if (startIndex != 0) {
            previousPageButon.style.display = 'block';
        }
    } else {
        nextPageButton.style.display = 'block';
        if (startIndex != 0) {
            previousPageButon.style.display = 'block';
        }
    }

    //change the page number
    var pageNumber = document.querySelector('#pageNum');
    pageNumber.innerText = "Page " + (currentPageNumber + 1) + "/" + Math.ceil(allPosts.length/4);
}

function backPage() {
    //ensure that you don't go back to a non-existant page
    if (currentPageNumber > 0) {
        currentPageNumber--;

        //remove everything (except for current Branch selector) and load new updates from array of updates
        var allPosts = document.querySelectorAll('.oldPosts');
        var postsArray = Array.from(allPosts);

        //load in new updates from next page
        //postsarray will be from the SQL
        // var oldPosts = postsArray;
        //hide all posts that aren't on the page
        for (let i = 0; i < postsArray.length; i++) {
            postsArray[i].style.display = 'none';
        }

        var startIndex = currentPageNumber * 4;
        var endIndex = (currentPageNumber + 1) * 4;

        //show the 4 visible posts on the page
        for (let i = startIndex; i < endIndex && i < allPosts.length; i++) {
            postsArray[i].style.display = 'block';
        }

        var newPostBox = document.querySelector('.newPost');
        var newPostTitle = document.querySelector('h2');
        if (currentPageNumber === 0) {
            newPostBox.classList.remove('hidden');
            newPostTitle.classList.remove('hidden');
        } else {
            newPostBox.classList.add('hidden');
            newPostTitle.classList.add('hidden');
        }

        // Hide or show the Next Page and the Previous page button based on whether there are more posts to display
        var nextPageButton = document.querySelector('.next');
        var previousPageButon = document.querySelector('.previous');
        if (startIndex === 0) {
            previousPageButon.style.display = 'none';
            nextPageButton.style.display = 'block';
        }
        else if (endIndex < allPosts.length) {
            previousPageButon.style.display = 'block';
            nextPageButton.style.display = 'block';
        }
    }

    //change the page number
    var pageNumber = document.querySelector('#pageNum');
    pageNumber.innerText = "Page " + (currentPageNumber + 1) + "/" + Math.ceil(allPosts.length/4);
}