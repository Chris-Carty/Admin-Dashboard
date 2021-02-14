// Global Variables

let employeeID;

let employeeProfile;

// ------------------//

$(document).ready(function () {
  buildTable();
});

function buildTable() {
  $.ajax({
    type: "GET",
    url: "php/getAll.php",
    dataType: "json",
    success: function (data) {
      var db = data.data;
      for (let i in db) {
        appendEntry(db, i);
      }
    },
  });
}

function signIn() {

  let username = $('#username').val()
  let password = $('#password').val()

  if ( username == 'Admin1' && password == '12345') {
    signInForm()
    signInSuccessful()
  } else {
    alert('Please enter a valid password & username combination')
  }
}

function signOut() {
  signInForm()
  signOutSuccessful()
}

function clearTable() {
  $("#database").html(`
    <tbody>
        <tr id="tableHeader">
            <th scope="col" class="hideCell" >ID</th>
            <th scope="col">Display Name</th>
            <th scope="col" class="hideCell" id="jobTitleHeader">Job Title</th>
            <th scope="col" class="hideCell">Email</th>
            <th scope="col" class="hideCell" id="departmentHeader">Department</th>
            <th scope="col" class="hideCell" id="locationHeader">Location</th>
            <th scope="col" class="hideCell" id="ManageHeader">Edit / Delete</th>
        </tr>
    </tbody>
    `);
}

function appendEntry(db, i, filterBy) {
  $("#database tbody").append(`
        <tr onclick="viewProfile(${JSON.stringify(db[i])
          .split('"')
          .join("&quot;")})">
            <th class="hideCell">${db[i].id}</th>
            <td><b>${db[i].lastName}</b>, ${db[i].firstName}</td>
            <td class=${filterBy == "jobTitle" ? "" : "hideCell"}>${
    db[i].jobTitle
  }</td>
            <td class="hideCell">${db[i].email}</td>
            <td class=${filterBy == "department" ? "" : "hideCell"}>${
    db[i].department
  }</td>
            <td class=${filterBy == "location" ? "" : "hideCell"}>${
    db[i].location
  }</td>
            <td class="hideCell"><button onclick="updateEmployeeToggle()"><img src="media/svg/icons8-edit.svg"></button><button id="delete" onclick="toggleAreYouSure2()"><img src="media/svg/trash-red.svg"></button></td>
        </tr>
    `);
}

function viewProfile(profile) {
  employeeProfile = profile;
  updateEmployeeToggle();

  //console.log(employeeProfile);

  $("#id").val(profile.id);
  $("#firstName").val(profile.firstName);
  $("#lastName").val(profile.lastName);
  $("#jobTitle").val(profile.jobTitle);
  $("#email2").val(profile.email);
  $("#department").val(profile.department);
  $("#location").val(profile.location);
}

function toggleReadOnly() {
  //updateProfile()

  if ($("#edit-mode-text").html() === "Off") {
    $("#edit-mode-text").html("On");
  } else {
    $("#edit-mode-text").html("Off");
  }

  if (document.getElementById("firstName").readOnly === true) {
    document.getElementById("firstName").readOnly = false;
  } else {
    document.getElementById("firstName").readOnly = true;
  }

  if (document.getElementById("lastName").readOnly === true) {
    document.getElementById("lastName").readOnly = false;
  } else {
    document.getElementById("lastName").readOnly = true;
  }

  if (document.getElementById("email2").readOnly === true) {
    document.getElementById("email2").readOnly = false;
  } else {
    document.getElementById("email2").readOnly = true;
  }

  if (document.getElementById("jobTitle").readOnly === true) {
    document.getElementById("jobTitle").readOnly = false;
  } else {
    document.getElementById("jobTitle").readOnly = true;
  }

  // POPULATE SELECT DEPARTMENT OPTIONS

  let entry = $("#profile").children().eq(5).children().eq(1);
  let entryText = entry.val();
  let id = entry.attr("id");

  if ($("#edit-mode-text").html() !== "Off") {
    $("#save-updates").show();

    entry.replaceWith(
      `<select class="form-control" name="department" onchange="updateLocation()" id='department'></select>`
    );

    let category = capitalize(id);
    selectOptions(category, id);

    $(`#department`).append(`<option selected="true">${entryText}</option>`);
  } else {
    $("#save-updates").hide();

    entry.replaceWith(
      `<input id="department" name="department" type="text" class="form-control" readonly>`
    );
    $(`#department`).val(entryText);
  }
}

function updateLocation() {
  $.getJSON(`php/getAllDepartments.php`, function (departments) {
    let locationID = departments.data.filter(
      (dep) => dep.name == $("#department").val()
    )[0].locationID;

    $.getJSON(`php/getAllLocations.php`, function (locations) {
      let location = locations.data.filter((loc) => loc.id == locationID)[0]
        .name;
      $("#location").val(location);
    });
  });
}

// ------ PHP / SQL DATABASE MODIFICATIONS ------ //

// ADD EMPLOYEE TO DATABASE

function addEmployeeData() {
  let departmentName = $("#addEmployeeDepartment").val();

  $.getJSON(`php/getAllDepartments.php`, function (departments) {
    let departmentID = departments.data.filter(
      (dep) => dep.name == departmentName
    )[0].id;

    if (
      $("#first-name").val() == "" ||
      $("#surname").val() == "" ||
      $("#job-title").val() == "" ||
      $("#email").val() == ""
    ) {
      alert("Please Fill in the Blanks");
      toggleAreYouSure();
    } else {
      $.ajax({
        data: {
          firstName: $("#first-name").val(),
          lastName: $("#surname").val(),
          jobTitle: $("#job-title").val(),
          email: $("#email").val(),
          departmentID: departmentID,
        },
        url: "php/insertEmployee.php",
        dataType: "json",
        success: function (data) {
          clearTable();

          $("#first-name").val("");
          $("#surname").val("");
          $("#job-title").val("");
          $("#email").val("");
          $("#department").find("option:eq(0)").prop("selected", true);

          $.when($.ajax(buildTable()));

          addEmployee();
          toggleAreYouSure();
          insertSuccessful();
        },
      });
    }
  });
}

// UPDATE EMPLOYEE IN DATABASE

function updateEmployee() {
  $.getJSON(`php/getAllDepartments.php`, function (departments) {
    let departmentID = departments.data.filter(
      (dep) => dep.name == $("#department").val()
    )[0].id;

    if (
      $("#firstName").val() == "" ||
      $("#lastName").val() == "" ||
      $("#jobTitle").val() == "" ||
      $("#email2").val() == ""
    ) {
      alert("Please Fill in the Blanks");
      closeUpdateEmployeeToggle();
    } else {
      $.ajax({
        data: {
          id: parseInt($("#id").val()),
          firstName: $("#firstName").val(),
          lastName: $("#lastName").val(),
          jobTitle: $("#jobTitle").val(),
          email: $("#email2").val(),
          departmentID: departmentID,
        },
        url: "php/updateEmployeeByID.php",
        dataType: "json",
        method: "POST",
        success: function (data) {
          clearTable();

          $.when($.ajax(buildTable()));
        },
      });

      toggleAreYouSure3();
      updateEmployeeToggle();
      updateSuccessful();
    }
  });
}

// REMOVE EMPLOYEE FROM DATABASE

function deleteEmployee() {
  $.ajax({
    data: { id: employeeID },
    url: "php/deleteEmployeeByID.php",
    dataType: "json",
    success: function (data) {
      clearTable();

      $.when($.ajax(buildTable()));

      toggleAreYouSure2();
    },
  });
}

// ADD DEPARTMENT TO DATABASE

function addDepartment() {
  let departmentName = $("#add-department").val();
  let locationName = $("#add-department-location").val();

  $.getJSON(`php/getAllLocations.php`, function (locations) {
    let locationID = locations.data.filter((loc) => loc.name == locationName)[0]
      .id;

    if ($("#add-department").val() == "") {
      alert("Please Enter Department Name");
      confirmAddDepartment();
    } else {
      $.ajax({
        data: {
          name: departmentName,
          locationID: locationID,
        },
        url: "php/insertDepartment.php",
        dataType: "json",
        success: function (data) {
          $("#add-department").val("");
          $("#add-department-location")
            .find("option:eq(0)")
            .prop("selected", true);

          addDepartmentSuccessful();
          confirmAddDepartment();
          manageDepartmentsToggle();
        },
      });
    }
  });
}

// DELETE DEPARTMENT FROM DATABASE

function deleteDepartment() {
  let departmentName = $("#remove-department").val();

  $.getJSON(`php/getAllDepartments.php`, function (departments) {
    let departmentID = departments.data.filter(
      (dep) => dep.name == departmentName
    )[0].id;

    $.ajax({
      data: {
        id: departmentID,
      },
      url: "php/deleteDepartmentByID.php",
      dataType: "json",
      success: function (data) {
        $("#remove-department").find("option:eq(0)").prop("selected", true);
        removeDepartmentSuccessful();
        manageDepartmentsToggle();
        confirmRemoveDepartment();
      },
    });
  });
}

// ADD LOCATION TO DATABASE

function addLocation() {
  let locationName = $("#add-location-name").val();

  if (locationName == "") {
    alert("Please Enter Location Name");
    confirmAddLocation();
  } else {
    $.ajax({
      data: {
        name: locationName,
      },
      url: "php/insertLocation.php",
      dataType: "json",
      success: function (data) {
        $("#add-location-name").val("");
        manageLocationsToggle();
        confirmAddLocation();
        addLocationSuccessful();
      },
    });
  }
}

// DELETE LOCATION FROM DATABASE

function deleteLocation() {
  let locationName = $("#add-locations").val();

  $.ajax({
    data: {
      name: locationName,
    },
    url: "php/deleteLocation.php",
    dataType: "json",
    success: function (data) {
      $("#add-locations").find("option:eq(0)").prop("selected", true);
      manageLocationsToggle();
      confirmRemoveLocation();
      removeLocationSuccessful();
    },
  });
}

// ------------------//

// ------ TOGGLE FORMS ------ //

// ADD EMPLOYEE FROM

function addEmployee() {
  let info = document.getElementById("add-employee-form");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";

  let selectArr = ["Department", "Location"];

  for (let i in selectArr) {
    selectOptions(selectArr[i], `addEmployee${selectArr[i]}`);
  }
}

// UPDATE EMPLOYEE FORM

function updateEmployeeToggle() {
  let info = document.getElementById("update-employee-form");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

// ADD DEPARTMENT FORM

function manageDepartmentsToggle() {
  let info = document.getElementById("manage-departments-form");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";

  selectOptions("Location", "add-department-location");
  selectOptions("Department", "remove-department");
}

function manageLocationsToggle() {
  let info = document.getElementById("manage-locations-form");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";

  selectOptions("Location", "add-locations");
}

function searchForm() {
  let info = document.getElementById("search-form");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

function signInForm() {
  let info = document.getElementById("sign-in-form");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}



// ------ NOTIFICATIONS ------ //

// CONFIRM ACTION NOTIFICATION(s)

function toggleAreYouSure() {
  var info = document.getElementById("areYouSure");
  var visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

function toggleAreYouSure2() {
  let e = window.event;
  employeeID = $(e.target).closest("tr").find("th").text();

  var info = document.getElementById("areYouSure2");
  var visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

function toggleAreYouSure3() {
  var info = document.getElementById("areYouSure3");
  var visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

function confirmAddDepartment() {
  var info = document.getElementById("confirm-add-department");
  var visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

function confirmRemoveDepartment() {
  var info = document.getElementById("confirm-remove-department");
  var visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

function confirmAddLocation() {
  var info = document.getElementById("confirm-add-location");
  var visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

function confirmRemoveLocation() {
  var info = document.getElementById("confirm-remove-location");
  var visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

// SUCCESS NOTIFICATION
function insertSuccessful() {
  $("#success-notification-wrapper").show();
  $("#success-notification-wrapper").addClass("animate__fadeInDown");
  window.setTimeout(function () {
    $("#success-notification-wrapper").hide();
    $("#success-notification-wrapper").removeClass("animate__fadeInDown");
  }, 2000);
}

// REMOVED NOTIFICATION

$(document).ready(function () {
  $(document).on("click", "#yes2", function () {
    $("#removed-notification-wrapper").show();
    $("#removed-notification-wrapper").addClass("animate__fadeInDown");
    window.setTimeout(function () {
      $("#removed-notification-wrapper").hide();
      $("#removed-notification-wrapper").removeClass("animate__fadeInDown");
    }, 2000);
  });
});

// UPDATED NOTIFICATION

function updateSuccessful() {
  $("#updated-notification-wrapper").show();
  $("#updated-notification-wrapper").addClass("animate__fadeInDown");
  window.setTimeout(function () {
    $("#updated-notification-wrapper").hide();
    $("#updated-notification-wrapper").removeClass("animate__fadeInDown");
  }, 2000);
}

// DEPARTENT ADDED SUCCESSFULLY NOTIFICATION

function addDepartmentSuccessful() {
  $("#department-notification-wrapper").show();
  $("#department-notification-wrapper").addClass("animate__fadeInDown");
  window.setTimeout(function () {
    $("#department-notification-wrapper").hide();
    $("#department-notification-wrapper").removeClass("animate__fadeInDown");
  }, 2000);
}

// DEPARTENT REMOVED SUCCESSFULLY NOTIFICATION

function removeDepartmentSuccessful() {
  $("#department-removed-notification-wrapper").show();
  $("#department-removed-notification-wrapper").addClass("animate__fadeInDown");
  window.setTimeout(function () {
    $("#department-removed-notification-wrapper").hide();
    $("#department-removed-notification-wrapper").removeClass(
      "animate__fadeInDown"
    );
  }, 2000);
}

// DEPARTENT ADDED SUCCESSFULLY NOTIFICATION

function addLocationSuccessful() {
  $("#location-notification-wrapper").show();
  $("#location-notification-wrapper").addClass("animate__fadeInDown");
  window.setTimeout(function () {
    $("#location-notification-wrapper").hide();
    $("#location-notification-wrapper").removeClass("animate__fadeInDown");
  }, 2000);
}

// DEPARTENT REMOVED SUCCESSFULLY NOTIFICATION

function removeLocationSuccessful() {
  $("#location-removed-notification-wrapper").show();
  $("#location-removed-notification-wrapper").addClass("animate__fadeInDown");
  window.setTimeout(function () {
    $("#location-removed-notification-wrapper").hide();
    $("#location-removed-notification-wrapper").removeClass(
      "animate__fadeInDown"
    );
  }, 2000);
}

// Sign In SUCCESSFUL NOTIFICATION

function signInSuccessful() {
  $("#signIn-notification-wrapper").show();
  $("#signIn-notification-wrapper").addClass("animate__fadeInDown");
  window.setTimeout(function () {
    $("#signIn-notification-wrapper").hide();
    $("#signIn-notification-wrapper").removeClass(
      "animate__fadeInDown"
    );
  }, 2200);
}

// Sign Out SUCCESSFUL NOTIFICATION

function signOutSuccessful() {
  $("#signOut-notification-wrapper").show();
  $("#signOut-notification-wrapper").addClass("animate__fadeInDown");
  window.setTimeout(function () {
    $("#signOut-notification-wrapper").hide();
    $("#signOut-notification-wrapper").removeClass(
      "animate__fadeInDown"
    );
  }, 2200);
}


// SORT & FILTER FUNCTIONS

function startsWith(db, i, filterBy, searchText) {

  var strLength =  searchText.length;

  if ((db[i][filterBy].toLowerCase()).slice(0, strLength) == searchText.toLowerCase()) {
      appendEntry(db, i, filterBy)
      return 1;
  }
  return 0;
}

function equals(db, i, filterBy, searchText) {

  if (db[i][filterBy].toLowerCase() == searchText.toLowerCase()) {
      appendEntry(db, i, filterBy)
      return 1;
  }
  return 0;
}

function search() {

  clearTable();
  searchForm();

  var filterBy = $('#filter-one').val()
  var filterQuery = $('#filter-two').val()
  var searchText = $('#searchText').val()

  $.ajax({
      type: 'GET',
      url: 'php/getAll.php', 
      dataType: 'json',
      success: function(data) {

          var db = data.data;

          for (let i in db) {

              switch (filterQuery) {
                  case "Starts with":
                      startsWith(db, i, filterBy, searchText)
                      break;
                  case "Equals":
                      equals(db, i , filterBy, searchText)
                      break;
                  default:
                      break;
              }
              
          }

          $(`#${filterBy}Header`).removeClass()

      }
  })

}

function resetTable() {

  $('#filter-one').val("default")
  $('#filter-two').val("default")
  $('#searchText').val("")

  clearTable()
  buildTable()
}


// SELECT DEPARTMENT OPTIONS NOTIFICATION

function selectOptions(category, selectID) {
  $(`#${selectID}`).empty();

  $.getJSON(`php/getAll${category}s.php`, function (category) {
    $.each(category.data, function (key, entry) {
      $(`#${selectID}`).append(
        $("<option></option>").attr("value", entry.name).text(entry.name)
      );
    });
  });
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}


