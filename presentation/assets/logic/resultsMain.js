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


function getResultsToTable() {
  fetch('/getAllResults', {
  }).then(function(res) {
    return res.json();
  }).then(function(data) {
    var arrayOfResults = JSON.parse(data);

    var table = document.getElementById('dataTable');  // getting the table element
    // inserting the rows into the table with patients data
    var i;
    for (i = 0; i < arrayOfResults.length; i++) {
      var row = table.insertRow(i + 1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);

      cell1.innerHTML = arrayOfResults[i].id;
      cell2.innerHTML = arrayOfResults[i].date;
      cell3.innerHTML = arrayOfResults[i].result;
    }
  })
}

var arrayOfPatients = new Array();  // the array that stores all patients
getDataToComboBox();  // sets up the combo-box with patients data

var arrayOfResults = new Array();  // the array that stores all results
getResultsToTable();

// --------------------- Get Selected Result Test from Radio Buttons ---------------------- //
function getSelectedRadioBtn() {
  if (document.getElementById('radio-alpha').checked) {
    return "Positive";
  } else if (document.getElementById('radio-beta').checked) {
    return "Negative";
  } else {
    return "Pending";
  }
}

// --------------------- Prepare Results Data ---------------------- //
var patientIDComboBox, patientID, appointmentResult;
function prepareResultsData() {
  patientIDComboBox = document.getElementById('category');
  patientID = patientIDComboBox.options[patientIDComboBox.selectedIndex].text;
  appointmentResult = getSelectedRadioBtn();
}

// --------------------- Refresh Table ---------------------- //
// setting the action to the refresh table option
document.getElementById('refreshTableBtn').onclick = function() {
  window.location.reload();
}

//--------------------- Add Result ---------------------- //
// Setting the action to the add result button
document.getElementById('addResultBtn').onclick = function() {
  prepareResultsData();
  fetch('/addResult/' + patientID + '/' + appointmentResult, {
  })
  // .then(function(res) {
  //   return res.json();
  // }).then(function(data) {
  //   alert(data.message);
  // })

}

//--------------------- Get Result ---------------------- //
// Setting the action to the get appointment button
document.getElementById('getResultBtn').onclick = function() {
  prepareResultsData();
  // requesting server to get result
  fetch('/getResult/' + patientID, {
  }).then(function(res) {
    return res.json();
  }).then(function(data) {
    var arrayOfResultsGet = JSON.parse(data);
    // setting result data to the corresponding field
    if (arrayOfResultsGet[0].localeCompare("Positive") === 0) {
      document.getElementById('radio-alpha').checked = true;
      document.getElementById('radio-beta').checked = false;
      document.getElementById('radio-gamma').checked = false;
    } else if (arrayOfResultsGet[0].localeCompare("Negative") === 0) {
      document.getElementById('radio-alpha').checked = false;
      document.getElementById('radio-beta').checked = true;
      document.getElementById('radio-gamma').checked = false;
    } else {
      document.getElementById('radio-alpha').checked = false;
      document.getElementById('radio-beta').checked = false;
      document.getElementById('radio-gamma').checked = true;
    }
  })
}

//--------------------- Update Result ---------------------- //
// Setting the action to the update appointment button
document.getElementById('updateResultBtn').onclick = function() {
  prepareResultsData();
  fetch('/updateResult/' + patientID + '/' + appointmentResult, {
  })
}

//--------------------- Delete Result ---------------------- //
// Setting the action to the delete appointment button
document.getElementById('deleteResultBtn').onclick = function() {
  prepareResultsData();
  // requesting server to delete result
  fetch('/deleteResult/' + patientID, {
  })

}

//--------------------- Reset ---------------------- //
// Setting the action to the reset appointment button
document.getElementById('resetBtn').onclick = function() {
  //document.getElementById('appointmentDate').value = "";
  //document.getElementById('appointmentTime').value = "";
}
