/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function showBranchOptions() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
        }
    }
}

function chooseBranch(branch) {
    var branchName = branch.textContent;
    var dropDown = document.querySelector(".dropbtn");
    dropDown.innerText = branchName + " ▼";
    document.getElementById("myDropdown").classList.remove("show");
}


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


}