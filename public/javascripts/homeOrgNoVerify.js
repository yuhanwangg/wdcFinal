document.addEventListener('DOMContentLoaded', function () {
    const descInput = document.querySelector('#descForm');
    const descCount = document.querySelector('.descCount');
    const descForm = document.querySelector('#descriptionForm');
    const webLinkForm = document.querySelector('#webLinkForm');
    const logoUploadForm = document.querySelector('#logoUploadForm');
    const max = 350;

    const ensureContentLength = (content, max) => {
        return content.length <= max;
    }

    descInput.onkeyup = function () {
        const remaining = max - this.value.length;
        descCount.innerHTML = remaining;  // Corrected 'innerHtml' to 'innerHTML'
    }

    document.querySelector('.webLink').style.display = 'none';
    document.querySelector('.logoUpload').style.display = 'none';

    descriptionForm.addEventListener('submit', function (e) {
        e.preventDefault();
        document.querySelector('.description').style.display = 'none';
        document.querySelector('.logoUpload').style.display = 'none';
        document.querySelector('.webLink').style.display = 'block';
    });

    webLinkForm.addEventListener('submit', function (e) {
        e.preventDefault();
        document.querySelector('.webLink').style.display = 'none';
        document.querySelector('.description').style.display = 'none';
        document.querySelector('.logoUpload').style.display = 'block';
    });

    logoUploadForm.addEventListener('submit', function (e) {
        e.preventDefault();
        window.location.href = 'homeOrgVerified.html';
    });
});

