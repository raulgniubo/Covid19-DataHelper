
// --------------------- Prepare Data to Register ---------------------- //
var userID, masterCode, passwordID;
function prepareToRegister() {
  userID = document.getElementById('userIDRegister').value;
  passwordID = document.getElementById('passwordIDRegister').value;
  masterCode = document.getElementById('masterCodeRegister').value;
}

// --------------------- Prepare Data to Login ---------------------- //
var userIDLogin, passwordIDLogin;
function prepareToLogin() {
  userIDLogin = document.getElementById('userIDLogin').value;
  passwordIDLogin = document.getElementById('passwordIDLogin').value;
}

//--------------------- Register User ---------------------- //

// setting the action to the register button
document.getElementById('registerUserBtn').onclick = function() {
  prepareToRegister();
  if (document.getElementById("checkboxTermsAndConditions").checked) {

    // requesting server to register
    fetch('/register/' + userID + "/" + passwordID + "/" + masterCode, {
    }).then(function(res) {
      return res.json();
    }).then(function(data) {
      var arrayResponse = JSON.parse(data);

      if (arrayResponse[0].localeCompare("SUCCESS") === 0) {
        window.location.href = 'DashboardPage.html';
      } else if (arrayResponse[0].localeCompare("Master Code is Wrong!") === 0) {
        alert("Master Code is Wrong!");
      } else if (arrayResponse[0].localeCompare("Username already exists") === 0) {
        alert("Username already exists");
      }

    })

  } else {
    alert("You must accept the terms & conditions to continue!");
  }

}

//--------------------- Login User ---------------------- //

// setting the action to the login button
document.getElementById('loginUserBtn').onclick = function() {
  prepareToLogin();

  if (document.getElementById("loginTermsAndConditionsCheckBox").checked) {
    // requesting server to login
    fetch('/login/' + userIDLogin + "/" + passwordIDLogin, {
    }).then(function(res) {
      return res.json();
    }).then(function(data) {
      var arrayResponseLogin = JSON.parse(data);

      if (arrayResponseLogin[0].localeCompare("SUCCESS") === 0) {
        window.location.href = 'DashboardPage.html';
      } else if (arrayResponseLogin[0].localeCompare("Username Does Not exist! Try Again.") === 0) {
        alert("Username Does Not exist! Try Again.");
      } else if (arrayResponseLogin[0].localeCompare("Password is Wrong! Try Again.") === 0) {
        alert("Password is Wrong! Try Again.");
      }

    })
  } else {
    alert("You must accept the terms & conditions to continue!");
  }



}
