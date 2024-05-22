document.addEventListener("DOMContentLoaded", function () {
    let menu = document.querySelector('#menu-icon');
    let navbar = document.querySelector(".navbar");

    menu.onclick = () => {
        console.log("Menu icon clicked"); // Debugging statement
        navbar.classList.toggle('open');
        menu.classList.toggle('bx-x');
    }
});

// window.addEventListener('DOMContentLoaded', () => {
//     const xhrNavbar = new XMLHttpRequest();
//     xhrNavbar.open('GET', 'guestNav.html');
//     xhrNavbar.onreadystatechange = function () {
//         if (xhrNavbar.readyState === XMLHttpRequest.DONE) {
//             if (xhrNavbar.status === 200) {
//                 document.getElementById('navBarGuest').innerHTML = xhrNavbar.responseText;
//             } else {
//                 console.error('Error fetching navigation bar:', xhrNavbar.statusText);
//             }
//         }
//     };
//     xhrNavbar.send();

//     const xhrFooter = new XMLHttpRequest();
//     xhrFooter.open('GET', 'guestFooter.html');
//     xhrFooter.onreadystatechange = function () {
//         if (xhrFooter.readyState === XMLHttpRequest.DONE) {
//             if (xhrFooter.status === 200) {
//                 document.getElementById('footerGuest').innerHTML = xhrFooter.responseText;
//             } else {
//                 console.error('Error fetching footer:', xhrFooter.statusText);
//             }
//         }
//     };
//     xhrFooter.send();
// });