// Global Variables

let employeeID;

let profile = {
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    department: "",
    location: ""
}

$(document).ready(function() {
    buildTable();
})


function buildTable() {

    $.ajax({
        type: 'GET',
        url: 'php/getAll.php', 
        dataType: 'json',
        success: function(data) {
            var db = data.data;
            for (let i in db) {
                appendEntry(db, i)
            }
        }
    })
}

function clearTable() {

    $('#database').html(`
    <tbody>
        <tr id="tableHeader">
            <th scope="col" class="hideCell" >ID</th>
            <th scope="col">Display Name</th>
            <th scope="col" class="hideCell" id="jobTitleHeader">Job Title</th>
            <th scope="col" class="hideCell">Email</th>
            <th scope="col" class="hideCell" id="departmentHeader">Department</th>
            <th scope="col" class="hideCell" id="locationHeader">Location</th>
            <th scope="col" class="hideCell" id="ManageHeader">Manage</th>
        </tr>
    </tbody>
    `)
}

function appendEntry(db, i, filterBy) {

    $('#database tbody').append(`
        <tr onclick="viewProfile(${JSON.stringify(db[i]).split('"').join("&quot;")})">
            <th class="hideCell">${db[i].id}</th>
            <td><b>${db[i].lastName}</b>, ${db[i].firstName}</td>
            <td class=${(filterBy == "jobTitle") ? "" : "hideCell"}>${db[i].jobTitle}</td>
            <td class="hideCell">${db[i].email}</td>
            <td class=${(filterBy == "department") ? "" : "hideCell"}>${db[i].department}</td>
            <td class=${(filterBy == "location") ? "" : "hideCell"}>${db[i].location}</td>
            <td class="hideCell"><button onclick="updateEmployeeToggle()"><img src="media/svg/icons8-edit.svg"></button><button id="delete" onclick="toggleAreYouSure2()"><img src="media/svg/trash-red.svg"></button></td>
        </tr>
    `)
}

function viewProfile(profile) {
    //var text1 = profile.department;
    //$("select option").filter(function() {
    //may want to use $.trim in here
    //return $(this).text() == text1;
    //}).prop('selected', true);

    $('#id').attr("placeholder", profile.id);
    $('#firstName').val(profile.firstName);
    $('#lastName').val(profile.lastName);
    $('#jobTitle').val(profile.jobTitle)
    $('#email2').val(profile.email);
    $('#department').val(profile.department);
    $('#location').val(profile.location);

}

function toggleReadOnly() {

        //updateProfile()

        if ($('#edit-mode-text').html() === 'Off') {
            $('#edit-mode-text').html('On')
        } else {
            $('#edit-mode-text').html('Off')  
        };

        if (document.getElementById('firstName').readOnly === true) {
            document.getElementById('firstName').readOnly = false;
        } else {
            document.getElementById('firstName').readOnly = true
        };

        if (document.getElementById('lastName').readOnly === true) {
            document.getElementById('lastName').readOnly = false;
        } else {
            document.getElementById('lastName').readOnly = true
        };

        if (document.getElementById('email2').readOnly === true) {
            document.getElementById('email2').readOnly = false;
        } else {
            document.getElementById('email2').readOnly = true
        };

        if (document.getElementById('jobTitle').readOnly === true) {
            document.getElementById('jobTitle').readOnly = false;
        } else {
            document.getElementById('jobTitle').readOnly = true
        };

        // POPULATE SELECT DEPARTMENT OPTIONS

        let entry = $('#profile').children().eq(5).children().eq(1);
        let entryText = entry.val();
        let id = entry.attr('id')

        if ($('#edit-mode-text').html() !== 'Off') {

            $("#save-updates").show(); 

            entry.replaceWith(`<select class="form-control" name="department" onchange="updateLocation()" id='department'></select>`)

            let category = capitalize(id)
            selectOptions(category, id)

            $(`#department`).append(`<option selected="true">${entryText}</option>`)
           
        } else {

            $("#save-updates").hide(); 

            entry.replaceWith(`<input id="department" name="department" type="text" class="form-control" placeholder='${entryText}' required readonly>`)
        }

}

function updateLocation() {

$.getJSON(`php/getAllDepartments.php`, function (departments) {
    let locationID = departments.data.filter(dep => dep.name == $('#department').val())[0].locationID

    $.getJSON(`php/getAllLocations.php`, function (locations) { 
        let location = locations.data.filter(loc => loc.id == locationID)[0].name
        $('#location').val(location)

    })
})

}

// ------ PHP / SQL DATABASE MODIFICATIONS ------ // 

// ADD EMPLOYEE TO DATABASE

function addEmployeeData() {

        let departmentName = $('#addEmployeeDepartment').val()

        $.getJSON(`php/getAllDepartments.php`, function (departments) {
            let departmentID = departments.data.filter(dep => dep.name == departmentName)[0].id

        $.ajax({
            data: {
                'firstName': $('#first-name').val(),
                'lastName': $('#surname').val(),
                'jobTitle': $('#job-title').val(),
                'email': $('#email').val(),
                'departmentID': departmentID
            },
            url: 'php/insertEmployee.php', 
            dataType: 'json',
            success: function(data) {

                clearTable()

                $('#first-name').val("")
                $('#surname').val("")
                $('#job-title').val("")
                $('#email').val("")
                $('#department').find('option:eq(0)').prop('selected', true);

                $.when($.ajax(
                    buildTable()
                ))//.then(function () {
                   // editModeOn()
                //});
                addEmployee()
                toggleAreYouSure();
            }
        })
    })
}

// UPDATE EMPLOYEE IN DATABASE

function updateEmployee() {

    closeUpdateEmployeeToggle()

    $.getJSON(`php/getAllDepartments.php`, function (departments) {
        let departmentID = departments.data.filter(dep => dep.name == profile.department)[0].id

        $.ajax({
            data: {
                'id': parseInt($('#id').val()),
                'firstName': $('#firstName').val(),
                'lastName': $('#lastName').val(),
                'jobTitle': $('#jobTitle').val(),
                'email': $('#email2').val(),
                'departmentID': departmentID
            },
            url: 'php/updateEmployeeByID.php', 
            dataType: 'json',
            success: function(data) {
                console.log(data);
                clearTable()
    
                $.when($.ajax(
                    buildTable()
                ))//.then(function () {
                    //editModeOn()
                //});
            }
        })

    })
}

// REMOVE EMPLOYEE FROM DATABASE

function deleteEmployee() {

    $.ajax({
        data: {'id': employeeID},
        url: 'php/deleteEmployeeByID.php', 
        dataType: 'json',
        success: function(data) {
  
            clearTable()

            $.when($.ajax(
                buildTable()
            ))//.then(function () {
               // editModeOn()
            //}//);
            toggleAreYouSure2();

        }
    })
}

// ------------------// 

// ------ TOGGLE FORMS ------ // 

// ADD EMPLOYEE FROM

function addEmployee() {
    let info = document.getElementById('add-employee-form')
    let visibility = info.style.visibility;
    info.style.visibility = visibility == 'hidden' ? 'visible' : 'hidden';

    let selectArr = ['Department', 'Location']

    for (let i in selectArr) {
        selectOptions(selectArr[i],`addEmployee${selectArr[i]}`) 
    }
  }

  function closeAddEmployee() {
    addEmployee()
  }

   // UPDATE EMPLOYEE FORM

   function updateEmployeeToggle() {

    let info = document.getElementById('update-employee-form')
    let visibility = info.style.visibility;
    info.style.visibility = visibility == 'hidden' ? 'visible' : 'hidden';
  }

  function closeUpdateEmployee() {
    updateEmployeeToggle()
  }

  // ADD DEPARTMENT FORM

  // ------ NOTIFICATIONS ------ //

  // CONFIRM ACTION NOTIFICATION(s)

  function toggleAreYouSure() {
    var info = document.getElementById('areYouSure')
    var visibility = info.style.visibility;
    info.style.visibility = visibility == 'hidden' ? 'visible' : 'hidden';
  }

  function closeAreYouSure() {
    toggleAreYouSure();
  }

  function toggleAreYouSure2() {

    let e = window.event;
    employeeID = $(e.target).closest("tr").find("th").text()

    var info = document.getElementById('areYouSure2')
    var visibility = info.style.visibility;
    info.style.visibility = visibility == 'hidden' ? 'visible' : 'hidden';
  }

  function closeDeleteEmployee() {
    toggleAreYouSure2();
  }

  function toggleAreYouSure3() {

    var info = document.getElementById('areYouSure3')
    var visibility = info.style.visibility;
    info.style.visibility = visibility == 'hidden' ? 'visible' : 'hidden';
  }

  function closeUpdateEmployeeToggle() {
    toggleAreYouSure3();
  }

  // SUCCESS NOTIFICATION

  $(document).ready(function(){
    $(document).on("click","#yes",function() {
        $("#success-notification-wrapper").show();
        $("#success-notification-wrapper").addClass('animate__fadeInDown');
            window.setTimeout( function(){
                $("#success-notification-wrapper").hide();
                $("#success-notification-wrapper").removeClass('animate__fadeInDown');
         }, 2000);    
    });
    });

    // REMOVED NOTIFICATION

    $(document).ready(function(){
        $(document).on("click","#yes2",function() {
            $("#removed-notification-wrapper").show();
            $("#removed-notification-wrapper").addClass('animate__fadeInDown');
                window.setTimeout( function(){
                    $("#removed-notification-wrapper").hide();
                    $("#removed-notification-wrapper").removeClass('animate__fadeInDown');
             }, 2000);    
        });
        });

    // UPDATED NOTIFICATION

    $(document).ready(function(){
        $(document).on("click","#yes3",function() {
            $("#updated-notification-wrapper").show();
            $("#updated-notification-wrapper").addClass('animate__fadeInDown');
                window.setTimeout( function(){
                    $("#updated-notification-wrapper").hide();
                    $("#updated-notification-wrapper").removeClass('animate__fadeInDown');
             }, 2000);    
        });
        });

    // SELCT DEPARTMENT OPTIONS NOTIFICATION

        function selectOptions(category, selectID) {
            $(`#${selectID}`).empty();
        
            $.getJSON(`php/getAll${category}s.php`, function (category) {
                $.each(category.data , function (key, entry) {
                    $(`#${selectID}`).append($('<option></option>').attr('value', entry.name).text(entry.name));
                })
            }); 
        }

        function capitalize(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
     
    