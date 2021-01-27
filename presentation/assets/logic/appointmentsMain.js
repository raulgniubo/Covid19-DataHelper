// --------------------- Get Patients Data to Combo-Box ---------------------- //
// Getting all patients from the database and store them into the combo-box
function getDataToComboBox() {

  fetch('/getAllPatients', {
  }).then(function(res) {
    return res.json();
  }).then(function(data) {
    var arrayOfPatients = JSON.parse(data);

    var table = document.getElementById('dataTable');  // getting the table element
    var patientsComboBox = document.getElementById('category');  // getting the combo-box element

    // inserting the rows into the table with patients data
    var i;
    for (i = 0; i < arrayOfPatients.length; i++) {
      // creating the option to add it to the combo-box
      var patientInComboBox = document.createElement('option');
      patientInComboBox.text = arrayOfPatients[i].id;
      patientInComboBox.value = arrayOfPatients[i].id;
      patientsComboBox.add(patientInComboBox);
    }
  })

}

function getAppointmentsToTable() {
  fetch('/getAllAppointments', {
  }).then(function(res) {
    return res.json();
  }).then(function(data) {
    var arrayOfAppointments = JSON.parse(data);

    var table = document.getElementById('dataTable');  // getting the table element
    // inserting the rows into the table with patients data
    var i;
    for (i = 0; i < arrayOfAppointments.length; i++) {
      var row = table.insertRow(i + 1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);

      cell1.innerHTML = arrayOfAppointments[i].id;
      cell2.innerHTML = arrayOfAppointments[i].date;
      cell3.innerHTML = arrayOfAppointments[i].time;
    }
  })
}

var arrayOfPatients = new Array();  // the array that stores all patients
getDataToComboBox();  // sets up the combo-box with patients data

var arrayOfAppointments = new Array();  // the array that stores all appointments
getAppointmentsToTable();

// --------------------- Prepare Appointments Data ---------------------- //
var patientIDComboBox, patientID, appointmentDate, appointmentTime;
function prepareAppointmentsData() {
  patientIDComboBox = document.getElementById('category');
  patientID = patientIDComboBox.options[patientIDComboBox.selectedIndex].text;
  appointmentDate = document.getElementById('appointmentDate').value;
  appointmentTime = document.getElementById('appointmentTime').value;
}

// --------------------- Refresh Table ---------------------- //
// setting the action to the refresh table option
document.getElementById('refreshTableBtn').onclick = function() {
  window.location.reload();
}

//--------------------- Add Appointment ---------------------- //
// Setting the action to the add appointment button
document.getElementById('addAppointmentBtn').onclick = function() {
  prepareAppointmentsData();
  fetch('/addAppointment/' + patientID + '/' + appointmentDate + '/' + appointmentTime, {
  })
  // .then(function(res) {
  //   return res.json();
  // }).then(function(data) {
  //   alert(data.message);
  // })

  // resetting values of the text fields for the appointment
  document.getElementById('appointmentDate').value = "";
  document.getElementById('appointmentTime').value = "";

}

//--------------------- Get Appointment ---------------------- //
// Setting the action to the get appointment button
document.getElementById('getAppointmentBtn').onclick = function() {
  prepareAppointmentsData();
  // requesting server to get appointment
  fetch('/getAppointment/' + patientID, {
  }).then(function(res) {
    return res.json();
  }).then(function(data) {
    var arrayOfAppointmentsGet = JSON.parse(data);
    // setting appointment data to the corresponding field
    document.getElementById('appointmentDate').value = arrayOfAppointmentsGet[0];
    document.getElementById('appointmentTime').value = arrayOfAppointmentsGet[1];
  })
}

//--------------------- Update Appointment ---------------------- //
// Setting the action to the update appointment button
document.getElementById('updateAppointmentBtn').onclick = function() {
  prepareAppointmentsData();
  fetch('/updateAppointment/' + patientID + '/' + appointmentDate + '/' + appointmentTime, {
  })
}

//--------------------- Delete Appointment ---------------------- //
// Setting the action to the delete appointment button
document.getElementById('deleteAppointmentBtn').onclick = function() {
  prepareAppointmentsData();
  fetch('/deleteAppointment/' + patientID, {
  })

  // resetting values of the text fields for patients
  document.getElementById('appointmentDate').value = "";
  document.getElementById('appointmentTime').value = "";
}

//--------------------- Reset ---------------------- //
// Setting the action to the reset appointment button
document.getElementById('resetBtn').onclick = function() {
  document.getElementById('appointmentDate').value = "";
  document.getElementById('appointmentTime').value = "";
}
