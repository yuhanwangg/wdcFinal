function saveDetails() {

    var email = document.getElementById("email").value;
    var emailConfirm = document.getElementById("emaiConfirm").value;

    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;

    var password = document.getElementById("password").value;
    var newPassword = document.getElementById("newPassword").value;
    var newPasswordConfirm = document.getElementById("newPasswordConfirm").value;

    var suburb = document.getElementById("suburb").value;
    var state = document.getElementById("state").value;
    var postcode = document.getElementById("postcode").value;
    var country = document.getElementById("country").value;

    var checkboxFull =  document.getElementById("emailBox").value;

    //need to send this info to update in database BUT ONLY IF NOT EMPTY
    //do i send it all in one but then on the other side check if empty
    //OR do i have seperate requests for each block of data, email, name, location etc
    
}