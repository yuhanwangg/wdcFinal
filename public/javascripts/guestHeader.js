
document.addEventListener('DOMContentLoaded', function () {

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

             <div class="profile" v-if="sessionUserType === 'volunteer' || sessionUserType === 'organisation' || sessionUserType === 'admin'">
                <template v-for="item in updatedProfile">
                    <div class="profile" v-if="item.class && item.source" @click="toggleProfileDropDown">
                        <img :class="item.class" :src="item.source" alt="profilePic">
                        {{item.name}}
                    </div>
                </template>
        <div class="profileDropDown" :class="{ open: isProfileDropDownOpen }">
                            <a href="/settings">
                                <p>Settings</p>
                            </a>
                            <a href="/logOut">
                                <p>Log Out</p>
                            </a>
                        </div>
                    </div>

            <div class="bx bx-menu" id="menu-icon" @click="toggleNavigation"></div>
        </div>

    </header>
    `,
        data() {
            return {
                navigation: [
                    { name: "Home", url: "/home" },
                    { name: "Volunteer Opportunities", url: "/opportunities" },
                    { name: "Find Organisations", url: "/organisations" }
                ],
                button: [
                    { icon: "", class: "", source: "", name: "Sign Up", url: "/signUp" },
                    { class: "userLogIn", source: "", icon: "ri-user-fill", name: "Log in", url: "/logIn" }
                ],
                profile: [
                    { class: "profilPic", source: "/images_assets/defaultProfile.jpeg", name: this.userName }
                ],
                sessionUserType: null,
                isProfileDropDownOpen: false,
                userName: ""
            };
        },
        computed: {
            updatedProfile() {
                return this.profile.map(item => {
                    return { ...item, name: this.userName };
                });
            }
        },
        mounted() {
            fetch('/sessionUserType')
                .then(response => {
                    // respond w 200
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('failed to retrieve session user type');
                    }
                })
                .then(data => {
                    this.sessionUserType = data.userType;
                    this.updateNavigation(this.sessionUserType);
                })
                .catch(error => {
                    // If there is an error, log it to the console
                    console.error('Error retrieving session user type:', error);
                });
            fetch('/getName')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("name: ", data.name);
                    this.userName = data.name;
                })
                .catch(error => {
                    console.error('error fetching user name:', error);
                });
        },
        methods: {
            toggleNavigation() {
                let menu = document.querySelector('#menu-icon');
                let navbar = document.querySelector(".navbar");

                console.log("Menu icon clicked"); // Debugging statement
                navbar.classList.toggle('open');
                menu.classList.toggle('bx-x');
            },
            toggleProfileDropDown() {
                console.log("profile clicked!");

                this.isProfileDropDownOpen = !this.isProfileDropDownOpen;
            },
            updateNavigation(userType) {
                console.log("session user type: ", this.sessionUserType);
                // Update navigation based on session user type
                if (userType == null) {
                    this.navigation = [
                        { name: "Home", url: "/home" },
                        { name: "Volunteer Opportunities", url: "/opportunities" },
                        { name: "Find Organisations", url: "/organisations" }
                    ];
                    this.button = [
                        { icon: "", class: "", source: "", name: "Sign Up", url: "/signUp" },
                        { class: "userLogIn", source: "", icon: "ri-user-fill", name: "Log in", url: "/logIn" }
                    ];
                } else if (userType == "volunteer") {
                    this.navigation = [
                        { name: "Home", url: "/home" },
                        { name: "Volunteer Opportunities", url: "/opportunities" },
                        { name: "Find Organisations", url: "/organisations" },
                        { name: "RSVP'd", url: "/rsvpd" },
                        { name: "Updates", url: "/updates" }
                    ];
                    this.button = [
                    ];
                } else if (userType == "organisation") {
                    this.navigation = [
                        { name: "Home", url: "/home" },
                        { name: "Opportunities", url: "/opportunities" },
                        { name: "Updates", url: "/updates" },
                        { name: "Joined Volunteers", url: "/joinedVolunteers" }
                    ];
                    this.button = [
                    ];

                } else if (userType == "admin") {
                    this.navigation = [
                        { name: "Edit Users", url: "/editUser" },
                        { name: "Edit Organisations", url: "/editOrganisations" },
                        { name: "Admin", url: "/Admin" }
                    ];
                    this.button = [
                    ];
                }
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
