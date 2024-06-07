// handle user count
document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app',
        data: {
            userCount: 0 // Initialize userCount in Vue data
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
        },
        methods: {
            signUp() {
                navigateTo("/signUp");
            },
            volunButton() {
                navigateTo("/opportunities");
            },
            organButton() {
                navigateTo("/organisations");
            }
        }
    });
});

function navigateTo(location) {
    window.location.href = location;
}
