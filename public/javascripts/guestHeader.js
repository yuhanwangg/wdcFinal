document.addEventListener('DOMContentLoaded', function () {
    Vue.component('header-component', {
        template: `
    <header>
    <a href="/"><img class="logo" src="images_assets/logo.png" alt="logo"></a>
        <ul class="navbar">
            <li><a href="/">Home</a></li>
            <li><a href="/opportunities">Volunteer Opportunities</a></li>
            <li><a href="/organisations">Find Organisations</a></li>
        </ul>

        <div class="nav_buttons">
            <a href="/signUp">Sign Up</a>
            <a href="/logIn" class="userLogIn"><i class="ri-user-fill"></i>Log In</a>
            <div class="bx bx-menu" id="menu-icon" @click="toggleNavigation"></div>
        </div>
    </header>
    `,
        methods: {
            toggleNavigation() {
                let menu = document.querySelector('#menu-icon');
                let navbar = document.querySelector(".navbar");

                console.log("Menu icon clicked"); // Debugging statement
                navbar.classList.toggle('open');
                menu.classList.toggle('bx-x');
            }
        }
    });

    Vue.component('footer-component', {
        template: `
    <ul class="footer">
        <li><a href="/">Home</a></li>
        <li><a href="/opportunities">Volunteer Opportunities</a></li>
        <li><a href="/organisations">Find Organisations</a></li>
        <li><a href="/signUp">Sign up</a></li>
        <li><a href="/logIn">Login</a></li>
    </ul>
    `
    });

});

function navigateTo(location) {
    window.location.href = location;
}

