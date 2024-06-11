document.addEventListener("DOMContentLoaded", function () {
    const vueinst = new Vue({
        el: '#app',
        data: {
            result: [],
            notFoundShowing: false,
        },
        methods: {
            browse() {
                window.location.href = '/opportunities';
            },
        },
    });
    window.browse = vueinst.browse;
});