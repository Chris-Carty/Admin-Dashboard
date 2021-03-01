// Global Variables

//var console = {};
//console.log = function(){};
//console.warn = function(){};
//console.error = function(){};

//indow.console = console;

let employeeID;
let employeeProfile;
let editMode = "Off"
let departmentID;

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
      let db = data.data;
      console.log(db)
      for (let i in db) {
        appendEntry(db, i);
      }
    },
  });
}

function clearTable() {
  $("#database").html(`
    <tbody>
        <tr id="tableHeader">
            <th scope="col" class="hide2 coloured-bg">ID</th>
            <th scope="col" class="coloured-bg">Display Name</th>
            <th scope="col" class="hide coloured-bg" id="jobTitleHeader">Job Title</th>
            <th scope="col" class="hide coloured-bg">Email</th>
            <th scope="col" class="hide coloured-bg" id="departmentHeader">Department</th>
            <th scope="col" class="hide coloured-bg" id="locationHeader">Location</th>
            <th scope="col" class="coloured-bg text-right" id="ManageHeader">Edit / Delete</th>
        </tr>
    </tbody>
    `);
}

function appendEntry(db, i) {
  try {

    $("#database tbody").append(`
        <tr onclick="viewProfile(${JSON.stringify(db[i])
          .split('"')
          .join("&quot;")})">
            <th class="hide2">${db[i].id}</th>
            <td><b>${db[i].lastName}</b>, ${db[i].firstName}</td>
            <td class="hide">${
    db[i].jobTitle
  }</td>
            <td class="hide">${db[i].email}</td>
            <td class="hide">${
    db[i].department
  }</td>
            <td class="hide">${
    db[i].location
  }</td>
            <td class="text-right"><button onclick="toggleReadOnly(editMode)"><img src="media/svg/edit.svg"></button><button id="delete" onclick="toggleAreYouSure2()"><img src="media/svg/trash-red.svg"></button></td>
        </tr>
    `);

  } catch {
    console.error = function(){};
  }

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

function toggleReadOnly(mode) {
  //updateProfile()
  $("#edit-mode-text").html(mode)
  

  if ($("#edit-mode-text").html() === "Off") {
    $("#edit-mode-text").html("On");
  } else {
    $("#edit-mode-text").html("Off");
  }

  if ($("#edit-mode-text").html() === "On") {
    document.getElementById("firstName").readOnly = false;
  } else {
    document.getElementById("firstName").readOnly = true;
  }

  if ($("#edit-mode-text").html() === "On") {
    document.getElementById("lastName").readOnly = false;
  } else {
    document.getElementById("lastName").readOnly = true;
  }

  if ($("#edit-mode-text").html() === "On") {
    document.getElementById("email2").readOnly = false;
  } else {
    document.getElementById("email2").readOnly = true;
  }

  if ($("#edit-mode-text").html() === "On") {
    document.getElementById("jobTitle").readOnly = false;
  } else {
    document.getElementById("jobTitle").readOnly = true;
  }

  // POPULATE SELECT DEPARTMENT OPTIONS

  let entry = $("#profile").children().eq(5).children().eq(1);
  let entryText = entry.val();
  let id = entry.attr("id");
  console.log(entryText)

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

// BOOTSTRAP -- VALIDATOR

$('#form').validator().on('submit', function (e) {
  if (e.isDefaultPrevented()) {
    e.preventDefault();
  } else {
    e.preventDefault();
    toggleAreYouSure();
  }
})

$('#form2').validator().on('submit', function (e) {
  if (e.isDefaultPrevented()) {
    e.preventDefault();
  } else {
    e.preventDefault();
    toggleAreYouSure3();
  }
})

$('#form3').validator().on('submit', function (e) {
  if (e.isDefaultPrevented()) {
    e.preventDefault();
  } else {
    e.preventDefault();
    confirmAddDepartment()
  }
})


$('#form4').validator().on('submit', function (e) {
  if (e.isDefaultPrevented()) {
    e.preventDefault();
  } else {
    e.preventDefault();
    confirmAddLocation()
  }
})

$('#form5').validator().on('submit', function (e) {
  if (e.isDefaultPrevented()) {
    e.preventDefault();
  } else {
    e.preventDefault();
    search()
  }
})


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
      toggleReadOnly("On")
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
      updateEmployeeToggle()
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

function removeDepButton(){
  let departmentName = $("#remove-department").val();

  $.getJSON(`php/getAllDepartments.php`, function (departments) {
    departmentID = departments.data.filter(
      (dep) => dep.name == departmentName
    )[0].id;

    $.getJSON(`php/getPersonnel.php`, function (personnel) {

      let personnelArr = personnel.data.personnel
  
      const count = personnelArr.filter((obj) => obj.departmentID === departmentID).length;

      if (count > 0) {

        unableRemoveDepartment()

      } else {

        confirmRemoveDepartment()
        
      }
    })
  });

}

function deleteDepartment() {

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

function removeLocButton(){
  let locationName = $("#add-locations").val();

  $.getJSON(`php/getAllLocations.php`, function (locations) {
    locationID = locations.data.filter(
      (loc) => loc.name == locationName
    )[0].id;

    $.getJSON(`php/getAllDepartments.php`, function (departments) {

      let departmentsArr = departments.data
  
      const count = departmentsArr.filter((obj) => obj.locationID === locationID).length;

      if (count > 0) {

        unableRemoveLocation()

      } else {

        confirmRemoveLocation()
        
      }
    })
  });

}

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

function search() {

  clearTable();

  var searchText = $('#searchText').val().trim()

  $.ajax({
      type: 'GET',
      url: 'php/getAll.php', 
      dataType: 'json',
      success: function(data) {
          console.log("ReturnAllData:")
          console.log(data)

          let db = data.data;

          console.log(db);

          let searched_arr = db.filter(o =>
            Object.keys(o).some(k => o[k].toLowerCase().includes(searchText.toLowerCase())));

            searched_arr = searched_arr.filter( Boolean );

            console.log(searched_arr)
        
            for (let i in db) {
              appendEntry(searched_arr, i)
            } 
      }
  })

}


function resetTable() {

  $('#searchText').val("")

  clearTable()
  buildTable()
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

function closeUpdateEmployeeToggle() {

  let editMode = "On"
  toggleReadOnly(editMode)

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

// ------ NOTIFICATIONS ------ //

// CONFIRM ACTION NOTIFICATION(s)

function toggleAreYouSure() {
  let info = document.getElementById("areYouSure");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

function toggleAreYouSure2() {

  updateEmployeeToggle()

  let e = window.event;

  employeeID = $(e.target).closest("tr").find("th").text();

  let info = document.getElementById("areYouSure2");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

function stopEvent() {
  let info = document.getElementById("areYouSure2");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}


function toggleAreYouSure3() {
  let info = document.getElementById("areYouSure3");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

function confirmAddDepartment() {
  let info = document.getElementById("confirm-add-department");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

function confirmRemoveDepartment() {
  let info = document.getElementById("confirm-remove-department");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

function confirmAddLocation() {
  let info = document.getElementById("confirm-add-location");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

function confirmRemoveLocation() {
  let info = document.getElementById("confirm-remove-location");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

function unableRemoveDepartment() {
  let info = document.getElementById("unable-remove-department");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

function unableRemoveLocation() {
  let info = document.getElementById("unable-remove-location");
  let visibility = info.style.visibility;
  info.style.visibility = visibility == "hidden" ? "visible" : "hidden";
}

// ERROR NOTIFICATIONS 


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


// LOCATION ADDED SUCCESSFULLY NOTIFICATION

function addLocationSuccessful() {
  $("#location-notification-wrapper").show();
  $("#location-notification-wrapper").addClass("animate__fadeInDown");
  window.setTimeout(function () {
    $("#location-notification-wrapper").hide();
    $("#location-notification-wrapper").removeClass("animate__fadeInDown");
  }, 2000);
}

// LOCATION REMOVED SUCCESSFULLY NOTIFICATION

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


// SELECT POPULATE WITH OPTIONS

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

