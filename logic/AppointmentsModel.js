
var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require("./../ServiceAccountKey.json");

// As an admin, the app has access to read and write all data, regardless of Security Rules
var database = admin.database();
var ref = database.ref("restricted_access/secret_document");


/*
* addAppointment function:
* It adds an appointment to the database, validating
* that the correct input is given by the user.
*/

function addAppointment(patientID, appointmentDate, appointmentTime) {
    // checking that the patient exists
    database.ref().child("patients").orderByChild("id").equalTo(patientID).once("value",snapshot => {
      if (snapshot.exists()) {  // if the patient exists already, alert user!
        const userData = snapshot.val();

        database.ref().child("appointments").orderByChild("id").equalTo(patientID).once("value",snapshot => {
          if (snapshot.exists()) {  // if the appointment exists already, alert user!
            const userData = snapshot.val();
            //alert("A patient with that ID already has an appointment!");
          } else {  // if the appointment does not exist, then validate info to add it
            // validating if any of the fields are empty
            if (patientID === "" || appointmentDate === "" || appointmentTime === "") {
              // if any field is empty, alert the user!
              //alert("You must fill out everything to continue!");
            } else {  // if fields are good, then add the patient
                database.ref('appointments/'+patientID).set({
                  id: patientID,
                  date: appointmentDate,
                  time: appointmentTime
                  });
                //alert("Appointment Added");
            }
          }
        });

      } else {  // if the patient does not exist, alert user!
        //alert("A patient with that ID is not in the system! Register the patient first.");
      }
    });
}

/*
* updateAppointment function:
* It updates an appointment from a patient id given by the user.
*/

 function updateAppointment(patientID, appointmentDate, appointmentTime) {
    // checking that the patient exists
    database.ref().child("patients").orderByChild("id").equalTo(patientID).once("value",snapshot => {
      if (snapshot.exists()) {  // if the patient exists, validate to update data
        const userData = snapshot.val();
        // checking that the appointment exists
        database.ref().child("appointments").orderByChild("id").equalTo(patientID).once("value",snapshot => {
          if (snapshot.exists()) {  // if the appointment exists, validate to update data
            const userData = snapshot.val();
            // validating the data
            if (patientID === "" || appointmentDate === "" || appointmentTime === "") {
              // if any of the required fields is empty, alert user!
                //alert("You must fill out everything to continue!");
            } else {  // if fields are good, update data for the appointment
              database.ref('appointments/'+patientID).update({
                date: appointmentDate,
                time: appointmentTime
                });
              //alert("Appointment Updated");
            }

            // checking if the result for the appointment exists
            database.ref().child("results").orderByChild("id").equalTo(patientID).once("value",snapshot => {
              if (snapshot.exists()) {  // if the result exists, update data
                const userData = snapshot.val();
                // updating date for results
                database.ref('results/'+patientID).update({
                  date: appointmentDate + ", " + appointmentTime
                });

              } else {  // if the result does not exists, alert user!

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
* deleteAppointment function:
* It deletes an appointment from a patient id given by the user.
*/

function deleteAppointment(patientID) {
    // checking that the patient exists
    database.ref().child("patients").orderByChild("id").equalTo(patientID).once("value",snapshot => {
      if (snapshot.exists()) {
        // checking that the appointment exists
        database.ref().child("appointments").orderByChild("id").equalTo(patientID).once("value",snapshot => {
          if (snapshot.exists()) {  // if the appointment exists, delete it
            const userData = snapshot.val();
            // deleting appointment from the database data
            database.ref('appointments/'+patientID).remove();
            //alert("Appointment Deleted");

            // checking if there's a result for the appointment deleted
            database.ref().child("results").orderByChild("id").equalTo(patientID).once("value",snapshot => {
              if (snapshot.exists()) {  // if the result exists, delete it
                const userData = snapshot.val();
                // deleting result from the database data
                database.ref('results/'+patientID).remove();
                //alert("Appointment's result Deleted");
              } else {  // if the result does not exists

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

module.exports = { addAppointment, updateAppointment, deleteAppointment }