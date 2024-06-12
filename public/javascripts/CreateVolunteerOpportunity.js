document.addEventListener("DOMContentLoaded", function () {
    const vueinst = new Vue({
        el: '#app',
        data: {
            programName: '',
            selectedTag: '',
            addedTags: [],
            stadd: '',
            address: '',
            addressArr: [],
            timeCommitment: '',
            suitable: '',
            training: '',
            requirements: '',
            briefDescription: '',
            description: '',
            dates: '',
            branches: [],
            selectedBranch: null,
        },
        methods: {
            addTag() {
                if (this.selectedTag && !this.addedTags.includes(this.selectedTag)) {
                    this.addedTags.push(this.selectedTag);
                }
            },
            findAddress() {
                console.log("FIND ADDRESS IN HERE")
                this.address = document.querySelector("#address").value;
                console.log("the address sent: ", this.address)
                var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + address.value;
                fetch(url)
                    .then(response => response.json())
                    .then(
                        data => {
                            this.addressArr = data;
                            console.log("address: ", this.addressArr)
                        }
                    )
                    .then(
                        show => this.showAddress()
                    )
                    .catch(err => console.log(err))
            },
            showAddress() {
                let location = document.querySelector("#foundLocation");
                location.innerHTML = '';
                var address = this.addressArr;
                if (address.length === 1) {
                    address.forEach(element => {
                        location.innerHTML += "<div class='locationResults'>"
                            + element.display_name
                            + "<br> Lat: " + element.lat
                            + " Lng: " + element.lon
                            + "</div>"
                    })
                } else if (address.length > 1) {
                    location.innerHTML += "<p style='color: red; font-weight: bold'>Please be more specific! Multiple Addresses found</p>"
                    address.forEach(element => {
                        location.innerHTML += "<div class='locationResults'>"
                            + element.display_name
                            + "<br> Lat: " + element.lat
                            + " Lon: " + element.lon
                            + "</div>"
                    });
                } else {
                    location.innerHTML = "<p style='color: red; font-weight: bold'>Not found</p>"
                }
            },
            findBranches() {
                var xhttp1 = new XMLHttpRequest();
                xhttp1.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        vueinst.branches = JSON.parse(this.responseText);
                    } else if (this.status === 404) {
                        vueinst.notFoundShowing = true;
                    }
                };

                var searchQ = "/findBranches";

                xhttp1.open("GET", searchQ, true);
                xhttp1.send();
            },
            closeForm() {
                window.history.back();
            },
            submitForm() {
                // var addressform = vueinst.stadd.concat(", ", vueinst.suburb, ", ", vueinst.state, ", ", vueinst.postcode);
                var addressform = this.addressArr[0];
                // prevent them from submitting multiple addresses
                if (this.addressArr.length > 1) {
                    alert("Please be more specific! Multiple addresses found.");
                    return; // Prevent form submission
                } else if (this.addressArr.length === 0) {
                    alert("No address");
                    return;
                }

                var addressName = addressform.display_name;
                var addressLat = addressform.lat;
                var addressLon = addressform.lon;

                if (addressLat.length === 0 || addressLon.length === 0) {
                    alert("NO LAT OR LON");
                    return;
                }
                console.log("address' name: ", addressName)
                console.log("address' lat: ", addressLat)
                console.log("address' long: ", addressLon)

                var tags = vueinst.addedTags.join(", ");

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
                    address: addressName,
                    lat: addressLat,
                    long: addressLon,
                    commitment: vueinst.timeCommitment,
                    suitability: vueinst.suitable,
                    training: vueinst.training,
                    requirements: vueinst.requirements,
                    thumbnail: vueinst.briefDescription,
                    description: vueinst.description,
                    dates: vueinst.dates,
                    branchID: vueinst.selectedBranch.branchID,
                }));
            },
            removeTag(index) {
                this.addedTags.splice(index, 1);
            }
        },
        mounted() {
            this.findBranches();
        }
    });
});