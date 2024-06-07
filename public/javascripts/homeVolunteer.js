document.addEventListener("DOMContentLoaded", function () {
    let menu = document.querySelector('#menu-icon');
    let navbar = document.querySelector(".navbar");

    menu.onclick = () => {
        console.log("Menu icon clicked"); // Debugging statement
        navbar.classList.toggle('open');
        menu.classList.toggle('bx-x');
    }
});

// get the top few posts
document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app',
        data: {
            recentPosts: [],
            recentUpdates: [],
            userCount: 0
        },
        methods: {
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
            }
        },
        mounted() {
            fetch('/userCount')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    this.userCount = data.count;
                })
                .catch(error => {
                    console.error('Error fetching user count:', error);
                });
            // Fetch recent posts from server
            fetch('/recentPosts')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("successfully loaded post!");
                    this.recentPosts = data;
                })
                .catch(error => {
                    console.error('Error fetching recent posts:', error);
                });
            fetch('/recentUpdates')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("successfully loaded updates!");
                    this.recentUpdates = data;
                })
                .catch(error => {
                    console.error('Error fetching recent updates:', error);
                });
        }
    });
});