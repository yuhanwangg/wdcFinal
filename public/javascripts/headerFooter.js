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
                            <button @click='logOut'>Log Out</button>
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
                orgLogo: "",
                userName: "",
                verified: false
            };
        },
        mounted() {
            this.fetchSessionData();
        },
        computed: {
            updatedProfile() {
                return this.profile.map(item => {
                    return { ...item, name: this.userName };
                });
            }
        },
        methods: {
            async fetchSessionData() {
                try {
                    const [userTypeResponse, verifiedResponse, nameResponse] = await Promise.all([
                        fetch('/sessionUserType'),
                        fetch('/checkVerified'),
                        fetch('/getName')
                    ]);

                    if (userTypeResponse.ok) {
                        const userTypeData = await userTypeResponse.json();
                        this.sessionUserType = userTypeData.userType;
                    } else {
                        throw new Error('Failed to retrieve session user type');
                    }

                    if (verifiedResponse.ok) {
                        const verifiedData = await verifiedResponse.json();
                        this.verified = verifiedData.verified;
                    } else {
                        throw new Error('Failed to check verification status');
                    }

                    if (nameResponse.ok) {
                        const nameData = await nameResponse.json();
                        this.userName = nameData.name;
                    } else {
                        throw new Error('Failed to fetch user name');
                    }

                    if (this.sessionUserType === 'organisation') {
                        const logoResponse = await fetch('/getOrgLogo');
                        if (logoResponse.ok) {
                            console.log("hmm?")
                            const logoData = await logoResponse.json();
                            this.orgLogo = logoData.imgPath;
                            this.updateNavigation(this.sessionUserType);
                        } else {
                            throw new Error('Failed to fetch orgLogo');
                        }
                    }

                    this.updateNavigation(this.sessionUserType);
                } catch (error) {
                    console.error('Error fetching session data:', error);
                }
            },
            toggleNavigation() {
                let menu = document.querySelector('#menu-icon');
                let navbar = document.querySelector(".navbar");
                navbar.classList.toggle('open');
                menu.classList.toggle('bx-x');
            },
            toggleProfileDropDown() {
                this.isProfileDropDownOpen = !this.isProfileDropDownOpen;
            },
            logOut() {
                fetch('/logout', {
                    method: 'POST' // post request to log out
                }).then(response => {
                    if (response.ok) {
                        window.location.href = '/login'; // redirect to log in page
                    } else {
                        alert('Failed to log out');
                    }
                }).catch(error => {
                    console.error('Error logging out:', error);
                });
            },
            updateNavigation(userType) {
                console.log("user type: ", userType)
                if (userType === null) {
                    console.log('guest user')
                    this.navigation = [
                        { name: "Home", url: "/home" },
                        { name: "Volunteer Opportunities", url: "/opportunities" },
                        { name: "Find Organisations", url: "/organisations" }
                    ];
                    this.button = [
                        { icon: "", class: "", source: "", name: "Sign Up", url: "/signUp" },
                        { class: "userLogIn", source: "", icon: "ri-user-fill", name: "Log in", url: "/logIn" }
                    ];
                } else if (userType === "volunteer") {
                    console.log('volunteer user')
                    this.navigation = [
                        { name: "Home", url: "/home" },
                        { name: "Volunteer Opportunities", url: "/opportunities" },
                        { name: "Find Organisations", url: "/organisations" },
                        { name: "RSVP'd", url: "/rsvpd" },
                        { name: "Updates", url: "/updates" }
                    ];
                    this.button = [];
                } else if (userType === "organisation") {
                    console.log('organisation user')
                    if (this.verified == true) {
                        console.log("yes, verified! this is an: ", userType);
                        this.navigation = [
                            { name: "Home", url: "/home" },
                            { name: "Opportunities", url: "/opportunities" },
                            { name: "Updates", url: "/updates" },
                            { name: "Joined Volunteers", url: "/joinedUsers" }
                        ];
                        this.profile = [
                            { class: "profilPic", source: this.orgLogo, name: this.userName }
                        ]
                    } else {
                        this.navigation = [
                            { name: "Home", url: "/home" }
                        ];
                    }
                    this.button = [];
                } else if (userType === "admin") {
                    console.log('admin user')
                    this.navigation = [
                        { name: "Edit Users", url: "/editUser" },
                        { name: "Edit Organisations", url: "/editOrganisations" },
                        { name: "Admin", url: "/Admin" }
                    ];
                    this.button = [];
                }
            }
        }
    });

    Vue.component('footer-component', {
        template: `
        <ul class="footer">
            <template v-for="item in footer">
                <li>
                    <a :href="item.url">{{item.name}}</a>
                </li>
            </template>
        </ul>
        `,
        data() {
            return {
                footer: [
                    { name: "Home", url: "/home" },
                    { name: "Volunteer Opportunities", url: "/opportunities" },
                    { name: "Find Organisations", url: "/organisations" },
                    { name: "Sign Up", url: "/signUp" },
                    { name: "Log In", url: "/logIn" },
                    { name: "Contact Us", url: "/contactUs" }
                ],
                sessionUserType: null,
                verified: false
            };
        },
        mounted() {
            this.fetchSessionDataFooter();
        },
        methods: {
            async fetchSessionDataFooter() {
                try {
                    const [userTypeResponse, verifiedResponse] = await Promise.all([
                        fetch('/sessionUserType'),
                        fetch('/checkVerified')
                    ]);

                    if (userTypeResponse.ok) {
                        const userTypeData = await userTypeResponse.json();
                        this.sessionUserType = userTypeData.userType;
                    } else {
                        throw new Error('Failed to retrieve session user type');
                    }

                    if (verifiedResponse.ok) {
                        const verifiedData = await verifiedResponse.json();
                        this.verified = verifiedData.verified;
                        console.log("is verified? ", this.verified);
                    } else {
                        throw new Error('Failed to check verification status');
                    }

                    this.updateFooter(this.sessionUserType);
                } catch (error) {
                    console.error('Error fetching session data:', error);
                }
            },
            updateFooter(userType) {
                if (userType === null) {
                    this.footer = [
                        { name: "Home", url: "/home" },
                        { name: "Volunteer Opportunities", url: "/opportunities" },
                        { name: "Find Organisations", url: "/organisations" },
                        { name: "Sign Up", url: "/signUp" },
                        { name: "Log In", url: "/logIn" },
                        { name: "Contact Us", url: "/contactUs" }
                    ];
                } else if (userType === "volunteer") {
                    this.footer = [
                        { name: "Home", url: "/home" },
                        { name: "Volunteer Opportunities", url: "/opportunities" },
                        { name: "Find Organisations", url: "/organisations" },
                        { name: "RSVP'd", url: "/rsvpd" },
                        { name: "Updates", url: "/updates" },
                        { name: "Settings", url: "/settings" },
                        { name: "Log Out", url: "/logOut" },
                        { name: "Contact Us", url: "/contactUs" }
                    ];
                } else if (userType === "organisation") {
                    console.log("is verified in footer? ", this.verified);
                    if (this.verified == true) {
                        this.footer = [
                            { name: "Home", url: "/home" },
                            { name: "Opportunities", url: "/opportunities" },
                            { name: "Updates", url: "/updates" },
                            { name: "Joined Volunteers", url: "/joinedVolunteers" },
                            { name: "Settings", url: "/settings" },
                            { name: "Log Out", url: "/logOut" },
                            { name: "Contact Us", url: "/contactUs" }
                        ];
                    } else {
                        this.footer = [
                            { name: "Home", url: "/home" },
                            { name: "Contact Us", url: "/contactUs" }
                        ];
                    }
                } else if (userType === "admin") {
                    this.footer = [
                        { name: "Edit Users", url: "/editUser" },
                        { name: "Edit Organisations", url: "/editOrganisations" },
                        { name: "Admin", url: "/Admin" },
                        { name: "Settings", url: "/settings" },
                        { name: "Log Out", url: "/logOut" },
                        { name: "Contact Us", url: "/contactUs" }
                    ];
                }
            }
        }
    });

});