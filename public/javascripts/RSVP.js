document.addEventListener('DOMContentLoaded', function () {
    // new Vue({
    //     el: '#app',
    //     data: {
    //         events: [],
    //         numPosts: 0,
    //         currPage: 1,
    //         numPages: 1,
    //         sliceStart: 0,
    //         sliceEnd: 4,
    //         tags: [],
    //         timeCommit: [],
    //         location: null
    //     },
    //     mounted() {
    //         this.updateSelectedOptions(document.querySelector("#tagsSelect"));
    //         this.updateSelectedOptions(document.querySelector("#commitmentSelect"))
    //     },
    //     methods: {
    //         // search for categories, time commitment or location
    //     }
    // });
    new Vue({
        el: '#app',
        data: {
            events: [],
            tags: [],
            commitments: [],
            location: null,
            numPosts: 0,
            submitClicked: false
        },
        mounted() {
            this.loadRSVPs();
        },
        methods: {

            loadRSVPs() {

                fetch('/getRSVPD', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        this.events = data;
                        console.log("returned data on load: ", data);
                    })
                    .catch(error => {
                        console.error('Error fetching RSVPs:', error);
                    });
            },
            submit() {
                console.log("WE HAVE CLICKED SUBMIT");
                this.submitClicked = true;
                let valid = true;
                this.location = document.querySelector(".searchLocation").value;

                const self = this; // Store reference to 'this'

                customSelects.forEach(function (customSelect) {
                    const selectedOptions = customSelect.querySelectorAll(".option.active");
                    const isCommitmentSelect = customSelect === customSelects[1];

                    selectedOptions.forEach(function (option) {
                        if (isCommitmentSelect) {
                            self.commitments.push({ // Use 'self' instead of 'this'
                                value: option.getAttribute("data-value"),
                                text: option.textContent.trim()
                            });
                        } else {
                            self.tags.push({ // Use 'self' instead of 'this'
                                value: option.getAttribute("data-value"),
                                text: option.textContent.trim()
                            });
                        }
                    });
                });

                if (valid) {
                    const requestData = {
                        commitments: this.commitments, // Use 'this' to access commitments and tags
                        tags: this.tags,
                        location: this.location
                    };

                    console.log("the data sent: ", requestData);

                    fetch('/findRSVP', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(requestData)
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log('Data received:', data);
                            //reset the custom selects after successful submission
                            this.events = data; // Use 'this' to access events
                            resetCustomSelects();
                            this.resetInputs();
                        })
                        .catch(error => {
                            console.error('Error during fetch operation:', error);
                        });
                }
            },
            resetInputs(){
                this.tags=[];
                this.commitments=[];
                this.location= null;
            },
            goTo(location) {
                window.location.href = location;
            },
            goToOppLink(oppID) {
                var link = '/MoreInformationOpportunity?id=' + oppID;
                window.location.href = link;
            }
        }
    })

    const customSelects = document.querySelectorAll(".custom-select");

    function updateSelectedOptions(customSelect) {
        const selectedOptions = Array.from(customSelect.querySelectorAll(".option.active")).filter(option => option !== customSelect.querySelector(".option.all-tags")).map(function (option) {
            return {
                value: option.getAttribute("data-value"),
                text: option.textContent.trim()
            };
        });

        const selectedValues = selectedOptions.map(function (option) {
            return option.value;
        });

        customSelect.querySelector(".tags_input").value = selectedValues.join(', ');

        let tagsHTML = "";

        if (selectedOptions.length === 0) {
            tagsHTML = '<span class="placeholder2">' + (customSelect === customSelects[1] ? 'Select your commitment' : 'Select the tags') + '</span>';
        } else {
            const maxTagsToShow = 2;
            let additionalTagsCount = 0;

            selectedOptions.forEach(function (option, index) {
                if (index < maxTagsToShow) {
                    tagsHTML += '<span class="tag">' + option.text + '<span class="remove-tag" data-value="' + option.value + '">&times;</span></span>';
                } else {
                    additionalTagsCount++;
                }
            });
            if (additionalTagsCount > 0) {
                tagsHTML += '<span class="tag">+' + additionalTagsCount + '</span>';
            }
        }
        customSelect.querySelector(".selected-options").innerHTML = tagsHTML;
    }

    customSelects.forEach(function (customSelect) {
        const searchInput = customSelect.querySelector(".search-tags");
        const optionsContainer = customSelect.querySelector(".options");
        const noResultMessage = customSelect.querySelector(".no-result-message");
        const options = customSelect.querySelectorAll(".option");
        const allTagsOption = customSelect.querySelector(".option.all-tags");
        const clearButton = customSelect.querySelector(".clear");

        allTagsOption.addEventListener("click", function () {
            const isActive = allTagsOption.classList.contains("active");
            options.forEach(function (option) {
                if (option !== allTagsOption) {
                    option.classList.toggle("active", !isActive);
                }
            });
            updateSelectedOptions(customSelect);
        });

        clearButton.addEventListener("click", function () {
            searchInput.value = "";
            options.forEach(function (option) {
                option.style.display = "block";
            });
            noResultMessage.style.display = "none";
        });

        searchInput.addEventListener("input", function () {
            const searchTerm = searchInput.value.toLowerCase();

            options.forEach(function (option) {
                const optionText = option.textContent.trim().toLowerCase();
                const shouldShow = optionText.includes(searchTerm);
                option.style.display = shouldShow ? "block" : "none";
            });

            const anyOptionsMatch = Array.from(options).some(option => option.style.display === "block");
            noResultMessage.style.display = anyOptionsMatch ? "none" : "block";

            if (searchTerm) {
                optionsContainer.classList.add("option-search-active");
            } else {
                optionsContainer.classList.remove("option-search-active");
            }
        });

        options.forEach(function (option) {
            option.addEventListener("click", function () {
                option.classList.toggle("active");
                updateSelectedOptions(customSelect);
            });
        });
    });

    document.addEventListener("click", function (event) {
        const removeTag = event.target.closest(".remove-tag");
        if (removeTag) {
            const customSelect = removeTag.closest(".custom-select");
            const valueToRemove = removeTag.getAttribute("data-value");
            const optionToRemove = customSelect.querySelector(".option[data-value='" + valueToRemove + "']");
            optionToRemove.classList.remove("active");

            const otherSelectedOptions = customSelect.querySelectorAll(".option.active:not(.all-tags)");
            const allTagsOption = customSelect.querySelector(".option.all-tags");
            if (otherSelectedOptions.length === 0) {
                allTagsOption.classList.remove("active");
            }
            updateSelectedOptions(customSelect);
        }
    });

    const selectBoxes = document.querySelectorAll(".select-box");
    selectBoxes.forEach(function (selectBox) {
        selectBox.addEventListener("click", function (event) {
            if (!event.target.closest(".tag")) {
                selectBox.parentNode.classList.toggle("open");
            }
        });
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".custom-select") && !event.target.classList.contains("remove-tag")) {
            customSelects.forEach(function (customSelect) {
                customSelect.classList.remove("open");
            });
        }
    });

    function resetCustomSelects() {
        customSelects.forEach(function (customSelect) {
            customSelect.querySelectorAll(".option.active").forEach(function (option) {
                option.classList.remove("active");
            });
            customSelect.querySelector(".option.all-tags").classList.remove("active");
            updateSelectedOptions(customSelect);
        });
    }

    if (customSelects.length > 0) {
        customSelects.forEach(customSelect => {
            updateSelectedOptions(customSelect);
        });
    }
});
