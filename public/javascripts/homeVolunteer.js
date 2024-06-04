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
            recentPosts: []
        },
        mounted() {
            // Fetch recent posts from server
            axios.get('/recentPosts')
                .then(response => {
                    console.log("successfully loaded post!");
                    this.recentPosts = response.data;
                })
                .catch(error => {
                    console.error('Error fetching recent posts:', error);
                });
        }
    });
});