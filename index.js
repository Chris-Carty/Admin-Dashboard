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

$("department").change(function(){
    console.log("CHANGED!!!!!")
    var selectedVal = $(this).val();
    switch(selectedVal){
        case '1':
            $(location).attr("placeholder", "Japan");
        break;
        case '2':
            market();
        break;
        case '3':
            segment();
        break;
        case '4':
            program();
        break;
        case '5':
            platform();
        break;
        case '6':
            platform();
        break;
        case '7':
            platform();
        break;
        case '8':
            platform();
        break;
        case '9':
            platform();
        break;
        case '10':
            platform();
        break;
        case '11':
            platform();
        break;
        case '12':
            platform();
        break;
    }
});

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

                console.log(data);
                
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

// BUTTONS

function addEmployee() {
    var info = document.getElementById('add-employee-form')
    var visibility = info.style.visibility;
    info.style.visibility = visibility == 'hidden' ? 'visible' : 'hidden';
  }

  function closeAddEmployee() {
    addEmployee()
  }