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
            axios.get('/userCount')
                .then(response => {
                    this.userCount = response.data.count;
                })
                .catch(error => {
                    console.error('Error fetching user count:', error);
                });
            // Fetch recent posts from server
            axios.get('/recentPosts')
                .then(response => {
                    console.log("successfully loaded post!");
                    this.recentPosts = response.data;
                })
                .catch(error => {
                    console.error('Error fetching recent posts:', error);
                });
            axios.get('/recentUpdates')
                .then(response => {
                    console.log("successfully loaded updates!");
                    this.recentUpdates = response.data;
                })
                .catch(error => {
                    console.error('Error fetching recent updates:', error);
                });
        }
    });
});