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

            var numberOfEntries = 0;

            for (let i in db) {
                appendEntry(db, i)
                numberOfEntries++
            }

            $('#numberOfEntries').html(numberOfEntries)

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
            <td class="hideCell"><button onclick="updateEmployee()"><img src="media/svg/icons8-edit.svg"></button><button id="delete" onclick="toggleAreYouSure2()"><img src="media/svg/trash-red.svg"></button></td>
        </tr>
    `)
}

function viewProfile(profile) {

    $('#id').attr("placeholder", profile.id);
    $('#firstName').attr("placeholder", profile.firstName);
    $('#lastName').attr("placeholder", profile.lastName);
    $('#jobTitle').attr("placeholder", profile.jobTitle)
    $('#email2').attr("placeholder", profile.email);
    $('#department2').attr("placeholder", profile.department);
    $('#location2').attr("placeholder", profile.location);

    //if ($('#editModeToggle').prop('checked') == true) {
     //   updateProfile()
   // }
    
}

// ------ PHP / SQL DATABASE MODIFICATIONS ------ // 

// ADD EMPLOYEE TO DATABASE

function addEmployeeData() {

        $.ajax({
            data: {
                'firstName': $('#first-name').val(),
                'lastName': $('#surname').val(),
                'jobTitle': $('#job-title').val(),
                'email': $('#email').val(),
                'departmentID': $('#department').val()
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

  // ------ TOGGLE FORMS ------ // 

  // ADD EMPLOYEE FROM

function addEmployee() {
    let info = document.getElementById('add-employee-form')
    let visibility = info.style.visibility;
    info.style.visibility = visibility == 'hidden' ? 'visible' : 'hidden';
  }

  function closeAddEmployee() {
    addEmployee()
  }

   // UPDATE EMPLOYEE FORM

   function updateEmployee() {
    let info = document.getElementById('update-employee-form')
    let visibility = info.style.visibility;
    info.style.visibility = visibility == 'hidden' ? 'visible' : 'hidden';
  }

  function closeUpdateEmployee() {
    updateEmployee()
  }

  // UPDATE COUNTRY IN ADD EMPLOYEE FORM UPON DEPARTMENT SELECTION

$("#department").change(function(){
    let selectedVal = $(this).val();
    switch(selectedVal){
        case '1':
        case '4':
        case '5':
            $("#location").attr("placeholder", "London");
        break;
        case '2':
        case '3':
            $("#location").attr("placeholder", "New York");
        break;
        case '6':
        case '7':
        case '12':
            $("#location").attr("placeholder", "Paris");
        break;
        case '8':
        case '9':
            $("#location").attr("placeholder", "Munich");
        break;
        case '10':
        case '11':
            $("#location").attr("placeholder", "Rome");
        break;
    }
});

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
        $(document).on("click","#XXXXXX",function() {
            $("#updated-notification-wrapper").show();
            $("#updated-notification-wrapper").addClass('animate__fadeInDown');
                window.setTimeout( function(){
                    $("#updated-notification-wrapper").hide();
                    $("#updated-notification-wrapper").removeClass('animate__fadeInDown');
             }, 1000);    
        });
        });
