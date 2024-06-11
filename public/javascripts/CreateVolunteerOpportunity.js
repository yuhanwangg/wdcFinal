document.addEventListener("DOMContentLoaded", function () {
    const vueinst = new Vue({
        el: '#app',
        data: {
            programName: '',
            selectedTag: '',
            addedTags: [],
            suburb: '',
            state: '',
            postcode: '',
            stadd: '',
            commitment: '',
            timeCommitment: '',
            suitable: '',
            training: '',
            requirements: '',
            thumbnail: '',
            description: '',
            dates: '',
        },
        methods: {
            addTag() {
            if (this.selectedTag && !this.addedTags.includes(this.selectedTag)) {
                this.addedTags.push(this.selectedTag);
            }
            },
            closeForm() {
                window.history.back();
            },
            submitForm() {
                var addressform = vueinst.stadd.concat(", ", vueinst.suburb, ", ", vueinst.state, ", ", vueinst.postcode);
                var tags = vueinst.addedTags.join(", ");
                console.log(addressform);

                var xhttp1 = new XMLHttpRequest();
                xhttp1.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        window.location.href = '/creationSuccess';
                    } else if (this.status === 409) {
                        alert("You have already joined this Organisation.");
                    } else if (this.status === 404) {
                        vueinst.notFoundShowing = true;
                    }
                };

                xhttp1.open("POST", "/createEvent", true);
                xhttp1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhttp1.send(JSON.stringify({
                    oppName: vueinst.programName,
                    tags: tags,
                    address: addressform,
                    commitment: vueinst.commitment,
                    suitability: vueinst.suitable,
                    training: vueinst.training,
                    requirements: vueinst.requirements,
                    thumbnail: vueinst.thumbnail,
                    description: vueinst.description,
                    dates: vueinst.dates,
                }));
            },
        },
    });
});