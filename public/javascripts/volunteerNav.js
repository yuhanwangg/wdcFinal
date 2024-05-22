document.addEventListener("DOMContentLoaded", function () {
    let menu = document.querySelector('#menu-icon');
    let navbar = document.querySelector(".navbar");

    menu.onclick = () => {
        console.log("Menu icon clicked"); // Debugging statement
        navbar.classList.toggle('open');
        menu.classList.toggle('bx-x');
    }
});