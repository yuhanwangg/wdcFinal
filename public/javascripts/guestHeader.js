
document.addEventListener('DOMContentLoaded', function () {
    const navigation = [
        { name: "Home", url: "/home" },
        { name: "Volunteer Opportunities", url: "/opportunities" },
        { name: "Find Organisations", url: "/organisations" }
        // { name: "RSVP'd", url: "/rsvpd" },
        // { name: "Updates", url: "/updates" },
        // { name: "Edit Users", url: "/editUser" },
        // { name: "Edit Organisations", url: "/editOrganisations" },
        // { name: "Admin", url: "/Admin" },
        // { name: "Joined Volunteers", url: "/joinedVolunteers" },
    ]
    const button = [
        // { source: "image_assets/defaultProfile", icon: "", class: "", name: "Name", url: "/settings" },
        { icon: "", class: "", source: "", name: "Sign Up", url: "/signUp" },
        { class: "userLogIn", source: "", icon: "ri-user-fill", name: "Log in", url: "/logIn" },
    ]


    Vue.component('header-component', {
        template: `
    <header>
    <a href="/"><img class="logo" src="images_assets/logo.png" alt="logo"></a>
        <ul class="navbar">
            <template v-for="item in navigation">
                <li><a :href="item.url">{{item.name}}</a></li>
            </template>
        </ul>

        <div class="nav_buttons">
            <template v-for="item in button">
                <a :href="item.url">
                <i :class="item.icon"></i>
                {{item.name}}
                </a>
            </template>
            <div class="bx bx-menu" id="menu-icon" @click="toggleNavigation"></div>
        </div>
    </header>
    `,
        data() {
            return {
                navigation: navigation,
                button: button
            };
        },
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
    new Vue({
        el: '#app'
    });

});

function navigateTo(location) {
    window.location.href = location;
}

