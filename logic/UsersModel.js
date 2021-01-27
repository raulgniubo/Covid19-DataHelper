
var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require("./../ServiceAccountKey.json");

// As an admin, the app has access to read and write all data, regardless of Security Rules
var database = admin.database();
var ref = database.ref("restricted_access/secret_document");

/*
* updateUser function:
* It updates a patient data from a patient id given by the user.
*/

function updateUser(username, password) {
    // checking that the patient exists
    database.ref().child("users").orderByChild("username").equalTo(username).once("value",snapshot => {
      if (snapshot.exists()) {  // if the user exists, validate to update data
        const userData = snapshot.val();
        // validating the data
        if (username === "" || password === "") {
          // if any of the required fields is empty, alert user!
            //alert("You must fill out everything to continue!");
        } else {  // if fields are good, update data for the user
          database.ref('users/'+username).update({
            username: username,
            password: password
            });
          //alert("User Updated");
        }
  
      } else {  // if the user does not exists, alert user!
        //alert("A User with that username is not in the system!");
      }
    });
}

/*
* deleteUser function:
* It deletes a patient data from a patient id given by the user.
*/

function deleteUser(username) {
    // checking that the user exists
    database.ref().child("users").orderByChild("username").equalTo(username).once("value",snapshot => {
      if (snapshot.exists()) {  // if the patient exists, delete it
        const userData = snapshot.val();
        // deleting user from the database data
        database.ref('users/'+username).remove();
        //alert("User Deleted");
  
      } else {  // if the user does not exists, alert user!
        //alert("A user with that username is not in the system!");
      }
    });
  }

module.exports = { updateUser, deleteUser }