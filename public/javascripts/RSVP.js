document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app',
        data: {
            events: [],
            numPosts: 0,
            currPage: 1,
            numPages: 1,
            sliceStart: 0,
            sliceEnd: 4
        },
        mounted() {

        },
        methods: {
            // search for categories, time commitment or location
        }
    });
});