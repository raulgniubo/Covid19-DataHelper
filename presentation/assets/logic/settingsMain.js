// --------------------- Get Users to Table ---------------------- //
// Getting all users from the database and store them into the table
function getData() {
    //PatientsModel.getAllPatients();
    fetch('/getAllUsers', {
    }).then(function(res) {
      return res.json();
    }).then(function(data) {
      var arrayOfUsers = JSON.parse(data);
  
      var table = document.getElementById('dataTable');  // getting the table element
  
      // inserting the rows into the table with patients data
      var i;
      for (i = 0; i < arrayOfUsers.length; i++) {
        var row = table.insertRow(i + 1);
  
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
  
        cell1.innerHTML = arrayOfUsers[i].username;
        cell2.innerHTML = "--------";
        cell3.innerHTML = "Employee";
      }
  
    })
  
  }

var arrayOfUsers = new Array();  // the array that stores all users
getData();  // set up the table with users data

// --------------------- Prepare Users Data ---------------------- //
var username, password, masterCode;
function prepareUsersData() {
  username = document.getElementById('usernameTextField').value;
  password = document.getElementById('passwordTextField').value;
  masterCode = document.getElementById('masterCodeTextField').value;
}

// --------------------- Refresh Table ---------------------- //
// setting the action to the refresh table option
document.getElementById('refreshTableBtn').onclick = function() {
  window.location.reload();
}

//--------------------- Get User ---------------------- //
// Setting the action to the get user button
document.getElementById('getUserBtn').onclick = function() {
    prepareUsersData();
    // requesting server to get user
    fetch('/getUser/' + username, {
    }).then(function(res) {
      return res.json();
    }).then(function(data) {
      var arrayUpdate = JSON.parse(data);
      document.getElementById('passwordTextField').value = arrayUpdate[0];
      document.getElementById('masterCodeTextField').value = "";
    })
}

//--------------------- Update User ---------------------- //
// Setting the action to the update user button
document.getElementById('updateUserBtn').onclick = function() {
    prepareUsersData();
    // requesting server to update user
    fetch('/updateUser/' + username + '/' + password + '/' + masterCode, {
    })
}

//--------------------- Delete User ---------------------- //
// Setting the action to the delete user button
document.getElementById('deleteUserBtn').onclick = function() {
    prepareUsersData();
    // requesting server to delete user
    fetch('/deleteUser/' + username, {
    })
  
    // resetting values of the text fields for users
    document.getElementById('usernameTextField').value = "";
    document.getElementById('passwordTextField').value = "";
    document.getElementById('masterCodeTextField').value = "";
  }