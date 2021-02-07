// Global Variables

let employeeID;

//employeeID = $(e.target).closest("tr").find("th").text()

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
        <tr onclick="loadProfile(${JSON.stringify(db[i]).split('"').join("&quot;")})">
            <th class="hideCell">${db[i].id}</th>
            <td><b>${db[i].lastName}</b>, ${db[i].firstName}</td>
            <td class=${(filterBy == "jobTitle") ? "" : "hideCell"}>${db[i].jobTitle}</td>
            <td class="hideCell">${db[i].email}</td>
            <td class=${(filterBy == "department") ? "" : "hideCell"}>${db[i].department}</td>
            <td class=${(filterBy == "location") ? "" : "hideCell"}>${db[i].location}</td>
            <td class="hideCell"><button><img src="media/svg/icons8-edit.svg"></button><button><img src="media/svg/trash-red.svg"></button></td>
        </tr>
    `)

}

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
        url: 'libs/php/deleteEmployeeByID.php', 
        dataType: 'json',
        success: function(data) {
  
            clearTable()

            $.when($.ajax(
                buildTable()
            )).then(function () {
                editModeOn()
            });

        }
    })
}


// UPDATE COUNTRY IN FORM UPON DEPARTMENT SELECTION

$("#department").change(function(){
    var selectedVal = $(this).val();
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

  // ------ FORMS ------ // 

  // ADD EMPLOYEE FROM

function addEmployee() {
    var info = document.getElementById('add-employee-form')
    var visibility = info.style.visibility;
    info.style.visibility = visibility == 'hidden' ? 'visible' : 'hidden';
  }

  function closeAddEmployee() {
    addEmployee()
  }

   // UPDATE EMPLOYEE FORM

   function updateEmployee() {
    var info = document.getElementById('add-employee-form')
    var visibility = info.style.visibility;
    info.style.visibility = visibility == 'hidden' ? 'visible' : 'hidden';
  }

  function closeUpdateEmployee() {
    updateEmployee()
  }



   // ADD DEPARTMENT FORM


  // ------ NOTIFICATIONS ------ //

  // CONFIRM ACTION NOTIFICATION

  function toggleAreYouSure() {
    var info = document.getElementById('areYouSure')
    var visibility = info.style.visibility;
    info.style.visibility = visibility == 'hidden' ? 'visible' : 'hidden';
  }

  function closeAreYouSure() {
    toggleAreYouSure();
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
        $(document).on("click","#delete",function() {
            $("#removed-notification-wrapper").show();
            $("#removed-notification-wrapper").addClass('animate__fadeInDown');
                window.setTimeout( function(){
                    $("#removed-notification-wrapper").hide();
                    $("#removed-notification-wrapper").removeClass('animate__fadeInDown');
             }, 1000);    
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
