
var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require("./../ServiceAccountKey.json");

// As an admin, the app has access to read and write all data, regardless of Security Rules
var database = admin.database();
var ref = database.ref("restricted_access/secret_document");


/*
* addResult function:
* It adds an result to the database, validating
* that the correct input is given by the user.
*/

function addResult(patientID, appointmentResult) {
    // checking that the patient exists
    database.ref().child("patients").orderByChild("id").equalTo(patientID).once("value",snapshot => {
      if (snapshot.exists()) {  // if the patient exists already, alert user!
        const userData = snapshot.val();
        // checking if the patient has an appointment
        database.ref().child("appointments").orderByChild("id").equalTo(patientID).once("value",snapshot => {
          if (snapshot.exists()) {  // if the appointment exists already, alert user!
            const userData = snapshot.val();
            // checking if the appointment has a result
            database.ref().child("results").orderByChild("id").equalTo(patientID).once("value",snapshot => {
              if (snapshot.exists()) {  // if the result exists already, alert user!
                const userData = snapshot.val();
                //alert("A result for that appointment already exists!");
              } else {  // if the result does not exist, then validate info to add it
                // validating if any of the fields are empty
                if (patientID === "" || appointmentResult === "") {
                  // if any field is empty, alert the user!
                  //alert("You must fill out everything to continue!");
                } else {  // if fields are good, then add the result

                  var dateAndTime;

                  database.ref('appointments/'+patientID).on('value', function(snapshot) {
                      var dateInDB = snapshot.val().date;
                      var timeInDB = snapshot.val().time;
                      dateAndTime = dateInDB + ", " + timeInDB;

                      database.ref('results/'+patientID).set({
                        id: patientID,
                        date: dateAndTime,
                        result: appointmentResult
                        });
                      //alert("Result Added");

                  });

                }
              }
            });

          } else {  // if the appointment does not exist, then validate info to add it
            //alert("There is no apointment for that user. Create appointment first!");
          }
        });

      } else {  // if the patient does not exist, alert user!
        //alert("A patient with that ID is not in the system! Register the patient first.");
      }
    });
}

/*
* updateResult function:
* It updates the appointment's result from a patient id given by the user.
*/

 function updateResult(patientID, appointmentResult) {
    // checking that the patient exists
    database.ref().child("patients").orderByChild("id").equalTo(patientID).once("value",snapshot => {
      if (snapshot.exists()) {  // if the patient exists, validate to update data
        const userData = snapshot.val();
        // checking that the appointment exists
        database.ref().child("appointments").orderByChild("id").equalTo(patientID).once("value",snapshot => {
          if (snapshot.exists()) {  // if the appointment exists, validate to update data
            const userData = snapshot.val();
            // checking if the appointment's result exists
            database.ref().child("results").orderByChild("id").equalTo(patientID).once("value",snapshot => {
              if (snapshot.exists()) {  // if the result exists, validate to update data
                const userData = snapshot.val();
                // validating the data
                if (patientID === "" || appointmentResult === "") {
                  // if any of the required fields is empty, alert user!
                    alert("You must fill out everything to continue!");
                } else {  // if fields are good, update data for the result
                  database.ref('results/'+patientID).update({
                    result: appointmentResult
                    });
                  //alert("Result Updated");
                }

              } else {  // if the result does not exists, alert user!
                //alert("A patient with that ID does not have an appointment's result yet!");
              }
            });

          } else {  // if the appointment does not exists, alert user!
            //alert("A patient with that ID does not have an appointment yet!");
          }
        });

      } else {  // if the patient does not exists, alert user!
        //alert("A patient with that ID is not in the system!");
      }
    });
}

/*
* deleteResult function:
* It deletes an appointment's result from a patient id given by the user.
*/

 function deleteResult(patientID) {
    // checking that the patient exists
    database.ref().child("patients").orderByChild("id").equalTo(patientID).once("value",snapshot => {
      if (snapshot.exists()) {
        // checking that the appointment exists
        database.ref().child("appointments").orderByChild("id").equalTo(patientID).once("value",snapshot => {
          if (snapshot.exists()) {  // if the appointment exists, delete it
            const userData = snapshot.val();
            // checking if the appointment's result exists
            database.ref().child("results").orderByChild("id").equalTo(patientID).once("value",snapshot => {
              if (snapshot.exists()) {  // if the result exists, delete it
                const userData = snapshot.val();
                // deleting appointment's result from the database data
                database.ref('results/'+patientID).remove();
                //alert("Appointment's result Deleted");

              } else {  // if the result does not exists, alert user!
                //alert("A patient with that ID does not have an appointment's result yet!");
              }
            });

          } else {  // if the appointment does not exists, alert user!
            //alert("A patient with that ID does not have an appointment yet!");
          }
        });

      } else {  // if the patient does not exists, alert user!
        //alert("A patient with that ID is not in the system!");
      }
    });
}


module.exports = { addResult, updateResult, deleteResult }