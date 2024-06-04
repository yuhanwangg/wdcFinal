var incorrectInfoShowing = false;
var notAllInfoFilled = false;
var emailTaken = false;

function createAdmin() {
    // console.log("clicked!")
    //get the elements

    const emailInput = document.getElementById('email');
    const emailConfirmInput = document.getElementById('emailConfirm');

    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');

    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('passwordConfirm');


    const email = document.getElementById('email').value;
    const emailConfirm = document.getElementById('emailConfirm').value;

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    const text = "Dear " + firstName + " " + lastName + ",<br><br> you are now an Admin for Heart!<br><br> Your account details are as follows: <br><br><b> First Name: </b>" + firstName + "<br><br><b>Last Name: </b>" + lastName + " <br><br><b>Email: </b>" + email + "<br><br><b> Password: </b>" + password + "<br><br> Please do not share these details with anyone. <br><br>Thank you for joining our program! <br><br> Kind regards, <br><br> The Heart Admin Team";
    const subject = "New Admin Confirmation";

    //check that there is info in all the boxes
    if (email.trim() && emailConfirm.trim() && firstName.trim() && lastName.trim() && password.trim() && passwordConfirm.trim()) {

        //check that the emails match and the passwords match
        if (email ===  emailConfirm && password === passwordConfirm) {
            // console.log("emails and passwords match!")
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    showSuccessMsg(firstName, lastName, email, password);
                    // console.log("added successfully!")
                }
                else if (this.status == 500) {
                    showEmailTakenMsg();
                }
            };
            xhttp.open("POST", "/addAdmin", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ first_name: firstName, last_name: lastName, email: email, password: password }));

        }

        else {
            showIncorrectInfoMsg();
        }
    }
    else {
        showNotAllFilledMsg();
    }
}

function goToAdminCreate() {
    window.location.href="AdminCreateAdmin.html";
}

function showNotAllFilledMsg() {
    //if the email taken box is showing, remove it
    if (emailTaken === true) {
        var emailTakenBox = document.getElementById('emailTaken');
        emailTakenBox.remove();
        emailTaken = false;
    }
    //if the incorrect info showing box is showing, remove it
    if (incorrectInfoShowing === true) {
        var incorrectInfoBox = document.getElementById('incorrectInfo');
        incorrectInfoBox.remove();
        incorrectInfoShowing = false;
    }

    //create a box saying not all info was filled
    if (notAllInfoFilled === false) {
        // error message, they don't align
        var filledMsg = document.createElement('div');
        filledMsg.id = 'notFilled';
        filledMsg.innerHTML ='<p>All fields must be filled</p>';

        var parent = document.querySelector('.contentWrapper');
        parent.appendChild(filledMsg);
        notAllInfoFilled = true;
    }
}

function showIncorrectInfoMsg(){
    //if the email taken box is showing, remove it
    if (emailTaken === true) {
        var emailTakenBox = document.getElementById('emailTaken');
        emailTakenBox.remove();
        emailTaken = false;
    }
    //if the not filled info  box is showing, remove it
    if (notAllInfoFilled === true) {
        var filledBox = document.getElementById('notFilled');
        filledBox.remove();
        notAllInfoFilled = false;
    }

    if (incorrectInfoShowing === false) {
        // error message, they don't align
        var incorrectInfoMsg = document.createElement('div');
        incorrectInfoMsg.id = 'incorrectInfo';
        incorrectInfoMsg.innerHTML ='<p>The emails and/or passwords do not match </p>';

        var contentParent = document.querySelector('.contentWrapper');
        contentParent.appendChild(incorrectInfoMsg);
        incorrectInfoShowing = true;
    }
}

function showSuccessMsg(firstName, lastName, email, password) {
    //create a pop up success box and back button
    console.log("we are HEREEEEEE");
    var createBox = document.getElementsByClassName('createAdmin')[0];
    createBox.remove();

    //if the incorrect info showing box is showing, remove it
    if (incorrectInfoShowing === true) {
        var incorrectInfoBox = document.getElementById('incorrectInfo');
        incorrectInfoBox.remove();
        incorrectInfoShowing = false;
    }
    //if the not filled info  box is showing, remove it
    if (notAllInfoFilled === true) {
        var filledBox = document.getElementById('notFilled');
        filledBox.remove();
        notAllInfoFilled = false;
    }
    //if the email taken box is showing, remove it
    if (emailTaken === true) {
        var emailTakenBox = document.getElementById('emailTaken');
        emailTakenBox.remove();
        emailTaken = false;
    }

    var createdSuccess = document.createElement('div');
    createdSuccess.classList.add('successBox');
    createdSuccess.innerHTML = '<p>Successfully created! Expect an email to their account, ' + email + ', shortly confirming.</p>';

    var continueButton = document.createElement('button');
    continueButton.id = 'continue';
    continueButton.textContent = 'Continue back to Admin Page';
    continueButton.onclick = goToAdminCreate;

    var content = document.querySelector('.contentWrapper');
    content.appendChild(createdSuccess);
    content.appendChild(continueButton);

    //send the email to the new account
    var xhttp2 = new XMLHttpRequest();

    xhttp2.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log("added successfully!")
        }
    };
    xhttp2.open("POST", "/email", true);
    xhttp2.setRequestHeader("Content-type", "application/json");
    xhttp2.send(JSON.stringify({ recipient: email, subject: subject, text: text}));
}

function showEmailTakenMsg() {
    //if the incorrect info showing box is showing, remove it
    if (incorrectInfoShowing === true) {
        var incorrectInfoBox = document.getElementById('incorrectInfo');
        incorrectInfoBox.remove();
        incorrectInfoShowing = false;
    }
    //if the not filled info  box is showing, remove it
    if (notAllInfoFilled === true) {
        var filledBox = document.getElementById('notFilled');
        filledBox.remove();
        notAllInfoFilled = false;
    }

    if (emailTaken === false) {
        // error message, they don't align
        var emailTakenMsg = document.createElement('div');
        emailTakenMsg.id = 'emailTaken';
        emailTakenMsg.innerHTML ='<p>This email is already being used by another admin</p>';

        var contentParent = document.querySelector('.contentWrapper');
        contentParent.appendChild(emailTakenMsg);
        emailTaken = true;
    }
}