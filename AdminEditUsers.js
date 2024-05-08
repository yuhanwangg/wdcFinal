var saveLabelShowing = false;
function saveUserInfoConfirm() {
    if (saveLabelShowing === false) {
        var confirmSave = document.createElement('div');
        confirmSave.className = 'saveSuccess';
        confirmSave.innerHTML ='<p>User information saved!</p>';

        var parent = document.querySelector('.contentWrapper');
        parent.appendChild(confirmSave);
        saveLabelShowing = true;
    }
}

function confirmDelete() {

}