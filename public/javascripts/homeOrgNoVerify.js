
document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app',
        data: {
            orgName: ''
        },
        mounted() {
            const descInput = document.querySelector('#descForm');
            const descCount = document.querySelector('.descCount');
            const descForm = document.querySelector('#descriptionForm');
            const webForm = document.querySelector('#webLinkForm');
            const webLinkInput = document.querySelector('#websiteLink');
            const logoUploadInput = document.querySelector('#logoInput');
            const logoUploadForm = document.querySelector('#logoUploadForm');
            const max = 750;

            // make it so even if the company reloads, they are kept on the page
            let desc = '';
            let link = '';
            if (descInput) {
                descInput.onkeyup = function () {
                    const remaining = max - this.value.length;
                    descCount.innerHTML = remaining;
                }
            }

            if (descForm) {
                descForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    if (descInput.value === '') {
                        console.log("empty input");
                        document.querySelector('.descWarning').style.display = 'inline';
                        // prevent from submitting
                    } else {
                        // send the value through
                        console.log("submitted description!");

                        desc = descInput.value;
                        console.log("desc: ", desc);

                        document.querySelector('.descWarning').style.display = 'none';
                        document.querySelector('.description').style.display = 'none';
                        document.querySelector('.webLink').style.display = 'block';
                        document.querySelector('.logoUpload').style.display = 'none';
                    }
                });
            }

            if (webForm) {
                webForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    if (webLinkInput.value === '') {
                        console.log("empty input");
                        document.querySelector('.linkWarning').style.display = 'inline';
                        // prevent from submitting
                    } else {
                        console.log("submitted weblink!");
                        link = webLinkInput.value;

                        console.log("link: ", link);

                        document.querySelector('.linkWarning').style.display = 'none';
                        document.querySelector('.webLink').style.display = 'none';
                        document.querySelector('.description').style.display = 'none';
                        document.querySelector('.logoUpload').style.display = 'block';
                    }
                });
            }

            if (logoUploadForm) {
                logoUploadForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const formData = new FormData(logoUploadForm);
                    const logoFile = formData.get('fileName');

                    if (logoUploadInput.value === '') {
                        console.log("empty logo upload");
                        document.querySelector('.logoWarning').style.display = 'inline';
                    } else {
                        console.log("submitted logo!");
                        console.log("logo path: ", logoUploadInput);
                        // upload everything
                        let descLinkSuccess = false;
                        fetch('/uploadDescLink', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ desc, link })
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to upload description and link');
                                }
                                return response.json();
                            })
                            .then(data => {
                                console.log("Description and link uploaded successfully:", data);
                                return fetch('/uploadLogo', {
                                    method: 'POST',
                                    body: formData
                                });
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to upload logo');
                                }
                                console.log('Logo uploaded successfully');
                                window.location.href = '/home';
                            })
                            .catch(error => {
                                console.error('Error in upload process:', error);
                            });
                    }
                });
            }

            document.querySelector('.webLink').style.display = 'none';
            document.querySelector('.logoUpload').style.display = 'none';

            fetch('/getName')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    this.orgName = data.name;
                })
                .catch(error => {
                    console.error('error fetching user name:', error);
                });
        },
        methods() {
            // put button functionality
        }
    });
});