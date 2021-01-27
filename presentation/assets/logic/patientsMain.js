// --------------------- Get Patients Data to Table ---------------------- //
// Getting all patients from the database and store them into the table
function getData() {
  //PatientsModel.getAllPatients();
  fetch('/getAllPatients', {
  }).then(function(res) {
    return res.json();
  }).then(function(data) {
    var arrayOfPatients = JSON.parse(data);

    var table = document.getElementById('dataTable');  // getting the table element

    // inserting the rows into the table with patients data
    var i;
    for (i = 0; i < arrayOfPatients.length; i++) {
      var row = table.insertRow(i + 1);

      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);

      cell1.innerHTML = arrayOfPatients[i].id;
      cell2.innerHTML = arrayOfPatients[i].fullname;
      cell3.innerHTML = arrayOfPatients[i].symptoms;
    }

  })

}

var arrayOfPatients = new Array();  // the array that stores all patients
getData();  // set up the table with patients data

// --------------------- Prepare Patients Data ---------------------- //
var patientID, patientFullName, patientSymptoms;
function preparePatientsData() {
  patientID = document.getElementById('patientIDTextField').value;
  patientFullName = document.getElementById('patientFullNameTextField').value;
  patientSymptoms = document.getElementById('patientSymptomsTextField').value;
}

// --------------------- Refresh Table ---------------------- //
// setting the action to the refresh table option
document.getElementById('refreshTableBtn').onclick = function() {
  window.location.reload();
}

//--------------------- Add Patient ---------------------- //
// Setting the action to the add patient button
document.getElementById('addPatientBtn').onclick = function() {
  preparePatientsData();
  // requesting server to add patient
  fetch('/addPatient/' + patientID + '/' + patientFullName + '/' + patientSymptoms, {
  })
  // resetting values of the text fields for patients
  document.getElementById('patientIDTextField').value = "";
  document.getElementById('patientFullNameTextField').value = "";
  document.getElementById('patientSymptomsTextField').value = "";

}

//--------------------- Get Patient ---------------------- //
// Setting the action to the get patient button
document.getElementById('getPatientBtn').onclick = function() {
  preparePatientsData();
  // requesting server to get patient
  fetch('/getPatient/' + patientID, {
  }).then(function(res) {
    return res.json();
  }).then(function(data) {
    var arrayUpdate = JSON.parse(data);
    document.getElementById('patientFullNameTextField').value = arrayUpdate[0];
    document.getElementById('patientSymptomsTextField').value = arrayUpdate[1];
  })
}


//--------------------- Update Patient ---------------------- //
// Setting the action to the update patient button
document.getElementById('updatePatientBtn').onclick = function() {
  preparePatientsData();
  // requesting server to update patient
  fetch('/updatePatient/' + patientID + '/' + patientFullName + '/' + patientSymptoms, {
  })
}

//--------------------- Delete Patient ---------------------- //
// Setting the action to the delete patient button
document.getElementById('deletePatientBtn').onclick = function() {
  preparePatientsData();
  // requesting server to delete patient
  fetch('/deletePatient/' + patientID, {
  })

  // resetting values of the text fields for patients
  document.getElementById('patientIDTextField').value = "";
  document.getElementById('patientFullNameTextField').value = "";
  document.getElementById('patientSymptomsTextField').value = "";
}

//--------------------- Reset ---------------------- //
// Setting the action to the reset patient button
document.getElementById('resetBtn').onclick = function() {
  document.getElementById('patientIDTextField').value = "";
  document.getElementById('patientFullNameTextField').value = "";
  document.getElementById('patientSymptomsTextField').value = "";
}
