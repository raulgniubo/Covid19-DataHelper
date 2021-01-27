
/* ----- Firebase ----- */

var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require("../ServiceAccountKey.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://covid19datahelper.firebaseio.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var database = admin.database();
var ref = database.ref("restricted_access/secret_document");

/* ----- Express ----- */

const express = require('express');
const { firestore } = require('firebase-admin');
const app = express();
const fs = require('fs');

/* ----- json ----- */

var bodyParser = require('body-parser');
app.use(bodyParser.json());  // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));  // support encoded bodies

app.set('view engine', 'ejs');
app.use(express.static('presentation'));

/* ----- Main in Server ----- */

// importing models
const patientsModel = require('../logic/PatientsModel');
const appointmentsModel = require('../logic/AppointmentsModel');
const resultsModel = require('../logic/ResultsModel');
const usersModel = require('../logic/UsersModel');

// listening for getAllPatients Request from front-end
app.get('/getAllPatients', function(req, res, next) {
    
    var arrayOfPatients = new Array();

    // looking for all patients
    database.ref('patients/').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;  // the id
          var childData = childSnapshot.val();  // the object containing the data
          arrayOfPatients.push(childData);  // To access the data: e.g. arrayOfPatients[0].id;
        })
        var arrayJson = JSON.stringify(arrayOfPatients);
        res.json(arrayJson);
        
    })
    
});

// listening for addPatient Request from front-end
app.get('/addPatient/:patientID/:patientFullName/:patientSymptoms', function(req, res, next) {
    var patientID = req.params.patientID;
    var patientFullName = req.params.patientFullName;
    var patientSymptoms = req.params.patientSymptoms;

    patientsModel.addPatient(patientID, patientFullName, patientSymptoms);
});

// listening for getPatient Request from front-end
app.get('/getPatient/:patientID', function(req, res, next) {
    var patientID = req.params.patientID;

    database.ref().child("patients").orderByChild("id").equalTo(patientID).once("value",snapshot => {
        if (snapshot.exists()) {  // if the patient exists, get the data
          const userData = snapshot.val();
          // getting the patient data
          database.ref('patients/'+patientID).on('value', function(snapshot) {
            var fullNameInDB = snapshot.val().fullname;
            var symptomsInDB = snapshot.val().symptoms;

            var array = new Array();

            // setting patient data to the corresponding field
            array.push(fullNameInDB);
            array.push(symptomsInDB);

            var arrayJson = JSON.stringify(array);
            res.json(arrayJson);
          });
        } else {  // if the patient does not exists, alert user!
          //alert("A patient with that ID is not in the system");
        }
      });
});

// listening for updatePatient Request from front-end
app.get('/updatePatient/:patientID/:patientFullName/:patientSymptoms', function(req, res, next) {
    var patientID = req.params.patientID;
    var patientFullName = req.params.patientFullName;
    var patientSymptoms = req.params.patientSymptoms;

    patientsModel.updatePatient(patientID, patientFullName, patientSymptoms);
});

// listening for deletePatient Request from front-end
app.get('/deletePatient/:patientID', function(req, res, next) {
    var patientID = req.params.patientID;

    patientsModel.deletePatient(patientID);
});

// listening for addAppointment Request from front-end
app.get('/addAppointment/:patientID/:appointmentDate/:appointmentTime', function(req, res, next) {
    var patientID = req.params.patientID;
    var appointmentDate = req.params.appointmentDate;
    var appointmentTime = req.params.appointmentTime;

    appointmentsModel.addAppointment(patientID, appointmentDate, appointmentTime);

    // res.setHeader('Content-Type', 'text/plain');
    // res.write("Hello, I made it!");
    // res.end();

    //res.json({ message: "Appointment Added"})

});


// listening for getAllAppointments Request from front-end
app.get('/getAllAppointments', function(req, res, next) {
    var arrayOfAppointments = new Array();

    // looking for all appointments
    database.ref('appointments/').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;  // the id
          var childData = childSnapshot.val();  // the object containing the data
          arrayOfAppointments.push(childData);  // To access the data: e.g. arrayOfPatients[0].id;
          
        })
        var arrayJson = JSON.stringify(arrayOfAppointments);
        res.json(arrayJson);
    })
});

// listening for getAppointment Request from front-end
app.get('/getAppointment/:patientID', function(req, res, next) {
    var patientID = req.params.patientID;

    database.ref().child("patients").orderByChild("id").equalTo(patientID).once("value",snapshot => {
        if (snapshot.exists()) {
          // checking if the appointment exists
          database.ref().child("appointments").orderByChild("id").equalTo(patientID).once("value",snapshot => {
            if (snapshot.exists()) {
                // if the appointment exists, get the data
              const userData = snapshot.val();
              // getting the appointment data
              database.ref('appointments/'+patientID).on('value', function(snapshot) {
                var dateInDB = snapshot.val().date;
                var timeInDB = snapshot.val().time;
  
                var array = new Array();
                array.push(dateInDB);
                array.push(timeInDB);

                var arrayJson = JSON.stringify(array);
                res.json(arrayJson);
              });
            } else {  // if the appointment does not exists, alert user!
              //alert("A patient with that ID does not have an appointment yet!");
            }
          });
  
        } else {  // if the patient does not exists, alert user!
          //alert("A patient with that ID is not in the system");
        }
      });
});


// listening for updateAppointment Request from front-end
app.get('/updateAppointment/:patientID/:appointmentDate/:appointmentTime', function(req, res, next) {
    var patientID = req.params.patientID;
    var appointmentDate = req.params.appointmentDate;
    var appointmentTime = req.params.appointmentTime;

    appointmentsModel.updateAppointment(patientID, appointmentDate, appointmentTime);
});

// listening for deleteAppointment Request from front-end
app.get('/deleteAppointment/:patientID', function(req, res, next) {
    var patientID = req.params.patientID;

    appointmentsModel.deleteAppointment(patientID);
});


app.get('/getAllResults', function(req, res, next) {
    var arrayOfResults = new Array();

    // looking for all results
    database.ref('results/').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;  // the id
            var childData = childSnapshot.val();  // the object containing the data
            arrayOfResults.push(childData);  // To access the data: e.g. arrayOfPatients[0].id;
        })
        var arrayJson = JSON.stringify(arrayOfResults);
        res.json(arrayJson);
    })
});

// listening for getAppointment Request from front-end
app.get('/getResult/:patientID', function(req, res, next) {
    var patientID = req.params.patientID;

    // checking that the patient exists
    database.ref().child("patients").orderByChild("id").equalTo(patientID).once("value",snapshot => {
        if (snapshot.exists()) {
          // checking if the appointment exists
          database.ref().child("appointments").orderByChild("id").equalTo(patientID).once("value",snapshot => {
            if (snapshot.exists()) {
                // if the appointment exists, get the data
              const userData = snapshot.val();
              // cheching if the result exists
              database.ref().child("results").orderByChild("id").equalTo(patientID).once("value",snapshot => {
                if (snapshot.exists()) {
                    // if the result exists, get the data
                  const userData = snapshot.val();
                  // getting the result data
                  database.ref('results/'+patientID).on('value', function(snapshot) {
                      var resultInDB = snapshot.val().result;
  
                      var array = new Array();
                      array.push(resultInDB);

                      var arrayJson = JSON.stringify(array);
                      res.json(arrayJson);
  
                  });
                } else {  // if the result does not exists, alert user!
                  //alert("A patient with that ID does not have appointment's result.");
                }
              });
  
            } else {  // if the appointment does not exists, alert user!
              //alert("A patient with that ID does not have an appointment yet! Create the appointment first.");
            }
          });
  
        } else {  // if the patient does not exists, alert user!
          //alert("A patient with that ID is not in the system");
        }
    });
});

// listening for addResult Request from front-end
app.get('/addResult/:patientID/:appointmentResult', function(req, res, next) {
    var patientID = req.params.patientID;
    var appointmentResult = req.params.appointmentResult;

    resultsModel.addResult(patientID, appointmentResult);
});

app.get('/updateResult/:patientID/:appointmentResult', function(req, res, next) {
    var patientID = req.params.patientID;
    var appointmentResult = req.params.appointmentResult;

    resultsModel.updateResult(patientID, appointmentResult);
});

// listening for deleteResult Request from front-end
app.get('/deleteResult/:patientID', function(req, res, next) {
    var patientID = req.params.patientID;

    resultsModel.deleteResult(patientID);
});

// listening for register Request from front-end
app.get('/register/:username/:password/:registerCode', function(req, res, next) {
    var username = req.params.username;
    var password = req.params.password;
    var registerCode = req.params.registerCode;

    var alertVar = "";
    var array = new Array();

    // checks if the username exists in the Database
    database.ref().child("users").orderByChild("username").equalTo(username).once("value",snapshot => {

        let registerCodeToRegister = "TEAM6TECH";
  
        if (snapshot.exists()){
          const userData = snapshot.val();
  
          // if the username exists, then alert user!
          alertVar = "Username already exists";
          array = new Array();
          array.push(alertVar);
      
          var arrayJson = JSON.stringify(array);
          res.json(arrayJson);

          //alert("Username already exists");
        } else {  // if the user is not in the system yet
          // check if users accept the terms and conditions checkbox and if the register code is correct
          if (registerCode.localeCompare(registerCodeToRegister) === 0) {
              // if the user accept and the code is correct, then create an account for he/she
              database.ref('users/'+username).set({
              username: username,
              password: password
            });

            alertVar = "SUCCESS";
            array = new Array();
            array.push(alertVar);
      
            var arrayJson = JSON.stringify(array);
            res.json(arrayJson);

          } else {
            // if the user typed the wrong register code, then alert user!
            alertVar = "Master Code is Wrong!";
            array = new Array();
            array.push(alertVar);
      
            var arrayJson = JSON.stringify(array);
            res.json(arrayJson);  
            
            //alert("Master Code is Wrong!");
          }
  
        }
      });

});

// listening for login Request from front-end
app.get('/login/:username/:password', function(req, res, next) {
    var username = req.params.username;
    var password = req.params.password;

    var alertVar = "";
    var array = new Array();

    // checks if the username exists in the Database
    database.ref().child("users").orderByChild("username").equalTo(username).once("value",snapshot => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            // if the username exists, then validate password
            database.ref('users/'+username).on('value', function(snapshot) {
                var passwordInDB = snapshot.val().password;

                // if password is validated, then login
                if (password.localeCompare(passwordInDB) === 0) {
                    alertVar = "SUCCESS";
                    array = new Array();
                    array.push(alertVar);
      
                    var arrayJson = JSON.stringify(array);
                    res.json(arrayJson);
                } else {  // if password is not validated, alert user!
                    alertVar = "Password is Wrong! Try Again.";
                    array = new Array();
                    array.push(alertVar);
      
                    var arrayJson = JSON.stringify(array);
                    res.json(arrayJson);
                    //alert("Password is Wrong! Try Again.");
                }
            });
        } else {  // if username does not exist, alert user!
            alertVar = "Username Does Not exist! Try Again.";
            array = new Array();
            array.push(alertVar);
      
            var arrayJson = JSON.stringify(array);
            res.json(arrayJson);
            //alert("Username Does Not exist! Try Again.");
        }
      });

});

// listening for getAllUsers Request from front-end
app.get('/getAllUsers', function(req, res, next) {
    
  var arrayOfUsers = new Array();

  // looking for all users
  database.ref('users/').once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;  // the id
        var childData = childSnapshot.val();  // the object containing the data
        arrayOfUsers.push(childData);  // To access the data: e.g. arrayOfUsers[0].username;
      })
      var arrayJson = JSON.stringify(arrayOfUsers);
      res.json(arrayJson);
      
  })
  
});

// listening for getUser Request from front-end
app.get('/getUser/:username', function(req, res, next) {
  var username = req.params.username;
  
  database.ref().child("users").orderByChild("username").equalTo(username).once("value",snapshot => {
      if (snapshot.exists()) {  // if the user exists, get the data
        const userData = snapshot.val();
        // getting the user data
        database.ref('users/'+username).on('value', function(snapshot) {
          var passwordInDB = snapshot.val().password;
          //var roleInDB = snapshot.val().role;

          var array = new Array();

          // setting user data to the corresponding field
          array.push(passwordInDB);
          //array.push(roleInDB);

          var arrayJson = JSON.stringify(array);
          res.json(arrayJson);
        });
      } else {  // if the user does not exists, alert user!
        //alert("A user with that username is not in the system");
      }
    });
});

// listening for updateUser Request from front-end
app.get('/updateUser/:username/:password/:masterCode', function(req, res, next) {
  var username = req.params.username;
  var password = req.params.password;
  var masterCode = req.params.masterCode;

  var realMasterCode = "TEAM6TECH";

  if (masterCode.localeCompare(realMasterCode) === 0) {
    usersModel.updateUser(username, password);
  } else {
    // alert user
  }
  
});

// listening for deleteUser Request from front-end
app.get('/deleteUser/:username', function(req, res, next) {
  var username = req.params.username;

  usersModel.deleteUser(username);
});

app.listen(3000);  // localhost:3000