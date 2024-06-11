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
            currPages: 1,
            sliceState: 0,
            sliceEnd: 4,
            submitClicked: false
        },
        mounted() {

        },
        methods: {
            submit() {
                console.log("WE HAVE CLICKED SUBMIT");
                this.submitClicked = true;
                let valid = true;
                this.location = document.querySelector(".searchLocation").value;

                const self = this; // Store reference to 'this'

                customSelects.forEach(function (customSelect) {
                    const selectedOptions = customSelect.querySelectorAll(".option.active");
                    const isCommitmentSelect = customSelect === customSelects[1];

                    if (selectedOptions.length === 0) {
                        const tagErrorMsg = customSelect.querySelector(".tag_error_msg");
                        tagErrorMsg.textContent = "This field is required";
                        tagErrorMsg.style.display = "block";
                        valid = false;
                    } else {
                        const tagErrorMsg = customSelect.querySelector(".tag_error_msg");
                        tagErrorMsg.textContent = "";
                        tagErrorMsg.style.display = "none";
                    }

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

                    console.log(requestData);

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
                        })
                        .catch(error => {
                            console.error('Error during fetch operation:', error);
                        });
                }
            },
            goTo(location) {
                window.location.href = location;
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

    // const submitButton = document.querySelector(".btn_submit");
    // submitButton.addEventListener("click", function () {
    //     let valid = true;

    //     customSelects.forEach(function (customSelect) {
    //         const selectedOptions = customSelect.querySelectorAll(".option.active");
    //     });
    //     if (valid) {
    //         let tags = document.querySelector(".tags_input").value;
    //         console.log(tags) //store tags
    //         resetCustomSelects();
    //     }
    // });
    // const submitButton = document.querySelector(".btn_submit");
    // submitButton.addEventListener("click", function () {
    //     console.log("WE HAVE CLICKED SUBMIT");
    //     let valid = true;
    //     let commitments = [];
    //     let tags = [];
    //     let locationSearch = document.querySelector(".searchLocation").value;

    //     customSelects.forEach(function (customSelect) {
    //         const selectedOptions = customSelect.querySelectorAll(".option.active");

    //         if (selectedOptions.length === 0) {
    //             const tagErrorMsg = customSelect.querySelector(".tag_error_msg");
    //             tagErrorMsg.textContent = "This field is required";
    //             tagErrorMsg.style.display = "block";
    //             valid = false;
    //         } else {
    //             const tagErrorMsg = customSelect.querySelector(".tag_error_msg");
    //             tagErrorMsg.textContent = "";
    //             tagErrorMsg.style.display = "none";
    //         }
    //     });

    //     customSelects.forEach(function (customSelect) {
    //         const selectedOptions = customSelect.querySelectorAll(".option.active");
    //         const isCommitmentSelect = customSelect === customSelects[1];

    //         if (selectedOptions.length === 0) {
    //             const tagErrorMsg = customSelect.querySelector(".tag_error_msg");
    //             tagErrorMsg.textContent = "This field is required";
    //             tagErrorMsg.style.display = "block";
    //             valid = false;
    //         } else {
    //             const tagErrorMsg = customSelect.querySelector(".tag_error_msg");
    //             tagErrorMsg.textContent = "";
    //             tagErrorMsg.style.display = "none";
    //         }

    //         selectedOptions.forEach(function (option) {
    //             if (isCommitmentSelect) {
    //                 commitments.push({
    //                     value: option.getAttribute("data-value"),
    //                     text: option.textContent.trim()
    //                 });
    //             } else {
    //                 tags.push({
    //                     value: option.getAttribute("data-value"),
    //                     text: option.textContent.trim()
    //                 });
    //             }
    //         });
    //     });

    //     if (valid) {
    //         // Send the tags and commitments as a POST request to the database
    //         const requestData = {
    //             commitments: commitments,
    //             tags: tags,
    //             location: locationSearch
    //         };

    //         console.log(requestData);

    //         // Assuming you are using fetch API for making POST requests
    //         fetch('/findRSVP', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(requestData)
    //         })
    //             .then(response => {
    //                 if (!response.ok) {
    //                     throw new Error('Network response was not ok');
    //                 }
    //                 return response.json();
    //             })
    //             .then(data => {
    //                 console.log('Data received:', data);
    //                 //reset the custom selects after successful submission
    //                 const userBoxContainer = document.querySelector('.UserBoxContainer');
    //                 userBoxContainer.innerHTML = '';

    //                 // Loop through the received data and generate user boxes
    //                 data.forEach(rsvp => {
    //                     // Create user box elements
    //                     const userBox = document.createElement('div');
    //                     userBox.classList.add('UserBox');

    //                     // Populate user box elements with data from the response
    //                     userBox.innerHTML = `
    //                         <div class="contentLeft">
    //                             <a href="${rsvp.programLink}" class="programName"><b>${rsvp.programName}</b></a>
    //                             <p>${rsvp.organisationName}</p>
    //                             <div class="tags">
    //                                 ${rsvp.tags.map(tag => `<p class="indvTag">${tag}</p>`).join('')}
    //                             </div>
    //                             <p>${rsvp.description} <a href="${rsvp.moreInfoLink}" class="moreInfo"><b>Click for more info!</b></a></p>
    //                         </div>
    //                         <div class="logoJoin">
    //                             <img src="${rsvp.logoSrc}" class="logo" alt="profilePic">
    //                         </div>
    //                     `;

    //                     // Append user box to the container
    //                     userBoxContainer.appendChild(userBox);
    //                 });

    //                 resetCustomSelects();
    //             })
    //             .catch(error => {
    //                 console.error('Error during fetch operation:', error);
    //             });
    //     }
    // });
});
