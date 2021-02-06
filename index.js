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
        </tr>
    `)

}


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
            }
        })
}

// UPDATE COUNTRY IN FORM UPON DEPARTMENT SELECTION

$("#department").change(function(){
    console.log("CHANGED!!!!!")
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

// BUTTONS

function addEmployee() {
    var info = document.getElementById('add-employee-form')
    var visibility = info.style.visibility;
    info.style.visibility = visibility == 'hidden' ? 'visible' : 'hidden';
  }

  function closeAddEmployee() {
    addEmployee()
  }