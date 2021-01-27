
var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require("./../ServiceAccountKey.json");

// As an admin, the app has access to read and write all data, regardless of Security Rules
var database = admin.database();
var ref = database.ref("restricted_access/secret_document");

/*
* addPatient function:
* It adds a patient to the database, validating
* that the correct input is given by the user.
*/

function addPatient(patientID, patientFullName, patientSymptoms) {
    // checking that the patient exists
    database.ref().child("patients").orderByChild("id").equalTo(patientID).once("value",snapshot => {
      if (snapshot.exists()) {  // if the patient exists already, alert user!
        const userData = snapshot.val();
        //alert("A patient with that ID is already in the system!");
      } else {  // if the patient does not exist, then validate info to add it
        // validating if any of the fields are empty
        if (patientID === "" || patientFullName === "" || patientSymptoms === "") {
          // if any field is empty, alert the user!
          
          //alert("Hello");

          //alert("You must fill out everything to continue!");
        } else {  // if fields are good, then add the patient
            database.ref('patients/'+patientID).set({
              id: patientID,
              fullname: patientFullName,
              symptoms: patientSymptoms
              });
            //alert("Patient Added");
        }
      }
    });
}

/*
* getPatient method:
* It gets the patient data from a patient id given by the user.
*/

function getPatient(patientID) {
  // checking that the patient exists
  database.ref().child("patients").orderByChild("id").equalTo(patientID).once("value",snapshot => {
    if (snapshot.exists()) {  // if the patient exists, get the data
      const userData = snapshot.val();
      // getting the patient data
      database.ref('patients/'+patientID).on('value', function(snapshot) {
          var fullNameInDB = snapshot.val().fullname;
          var symptomsInDB = snapshot.val().symptoms;

          // setting patient data to the corresponding field
          document.getElementById('patientFullNameTextField').value = fullNameInDB;
          document.getElementById('patientSymptomsTextField').value = symptomsInDB;
      });
    } else {  // if the patient does not exists, alert user!
      //alert("A patient with that ID is not in the system");
    }
  });
}

/*
* updatePatient function:
* It updates a patient data from a patient id given by the user.
*/

 function updatePatient(patientID, patientFullName, patientSymptoms) {
  // checking that the patient exists
  database.ref().child("patients").orderByChild("id").equalTo(patientID).once("value",snapshot => {
    if (snapshot.exists()) {  // if the patient exists, validate to update data
      const userData = snapshot.val();
      // validating the data
      if (patientID === "" || patientFullName === "" || patientSymptoms === "") {
        // if any of the required fields is empty, alert user!
          //alert("You must fill out everything to continue!");
      } else {  // if fields are good, update data for the patient
        database.ref('patients/'+patientID).update({
          fullname: patientFullName,
          symptoms: patientSymptoms
          });
        //alert("Patient Updated");
      }

    } else {  // if the patient does not exists, alert user!
      //alert("A patient with that ID is not in the system!");
    }
  });
}

/*
* deletePatient function:
* It deletes a patient data from a patient id given by the user.
*/

 function deletePatient(patientID) {
  // checking that the patient exists
  database.ref().child("patients").orderByChild("id").equalTo(patientID).once("value",snapshot => {
    if (snapshot.exists()) {  // if the patient exists, delete it
      const userData = snapshot.val();
      // deleting patient from the database data
      database.ref('patients/'+patientID).remove();
      //alert("Patient Deleted");

      // checks if an apointment for the patient deleted exists
      database.ref().child("appointments").orderByChild("id").equalTo(patientID).once("value",snapshot => {
        if (snapshot.exists()) {  // if the appointment exists, delete it
          const userData = snapshot.val();
          // deleting appointment from the database data
          database.ref('appointments/'+patientID).remove();
          //alert("Appointment for Patient Deleted");

          // checks if result for the appointment deleted exists
          database.ref().child("results").orderByChild("id").equalTo(patientID).once("value",snapshot => {
            if (snapshot.exists()) {  // if the result exists, delete it
              const userData = snapshot.val();
              // deleting result from the database data
              database.ref('results/'+patientID).remove();
              //alert("Appointment's result for Patient Deleted");
            } else {  // if the appointment does not exists, alert user!

            }
          });

        } else {  // if the appointment does not exists, alert user!

        }
      });

    } else {  // if the patient does not exists, alert user!
      //alert("A patient with that ID is not in the system!");
    }
  });
}


module.exports = { addPatient, getPatient, updatePatient, deletePatient }
