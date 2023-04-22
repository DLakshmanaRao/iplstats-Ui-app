var jwt = localStorage.getItem("token");
if (jwt == null) {
    window.location.href = "login.html";
}
const teamRoleStatChart = document.querySelector("#teamRoleStatChart");
const teamRoleDetails = document.querySelector("#teamRoleDetails");
const teamSelectId = document.querySelector("#teamSelectId");
const amountStatChart = document.querySelector("#amountStatChart");
const roleAmountChart = document.querySelector("#roleAmountChart");
const playerData = document.querySelector("#playerData");
const user = document.getElementById("user");
const role = document.getElementById("role");
var logout = document.getElementById("logout");

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
user.innerHTML = parseJwt(jwt).sub;
role.innerHTML = `(${parseJwt(jwt).roles[0]})`;

const baseUrl = "https://iplstatsapp.onrender.com/iplstats/api/v1";

google.charts.load('current', { 'packages': ['corechart'] });


function showTeamAmountStats() {
    var requestOptions = getHeaders('GET');
    fetch(`${baseUrl}/stats/team-stats`, requestOptions).then(res => res.json()).then(data => {
        drawColumnChart(data);
    }).catch(error => {
        console.log(error);
    })
}
function showRoleAmountStats() {
    var requestOptions = getHeaders('GET');
    fetch(`${baseUrl}/stats/role-stats`, requestOptions).then(res => res.json()).then(data => {
        google.charts.setOnLoadCallback(drawPieChart(data));
    }).catch(error => {
        console.log(error);
    })
}

function initTeamBasicDetails() {
    var requestOptions = getHeaders('GET');
    fetch(`${baseUrl}/team/basic-details`, requestOptions).then(res => res.json()).then(data => {
        let teamBasicDetails = data;
        showDropdownValues(teamBasicDetails);
    }).catch(error => {
        console.log(error);
    })
}
function showDropdownValues(teamBasicDetails) {
    let str = `<select class="form-select" id='selectedTeamId' onchange='showPlayerDetails()'>
        <option selected value=''>Select team</option>`;
    for (let i = 0; i < teamBasicDetails.length; i++) {
        team = teamBasicDetails[i];
        str += `<option value=${team.id}>${team.label} - <i>${team.name}</i></option>`
    }
    str += '</select>';

    teamSelectId.innerHTML = str;
}

function showPlayerDetails() {
    let teamId = document.querySelector('#selectedTeamId').value;
    if (teamId !== "") {
        var requestOptions = getHeaders('GET')
        fetch(`${baseUrl}/team/${teamId}/players`, requestOptions).then(res => res.json()).then(data => {
            viewPlayerDetails(data);
        }).catch(error => {
            console.log(error);
        })
    }

}

function viewPlayerDetails(players) {
    let str = "Please select team name to see player information";
    console.log(players);
    if (players.length > 0) {
        str = '<table class="table table-striped">';
        str += '<thead><tr><th>Name</th><th>Role</th><th>Country</th><th>Amount</th></tr></thead>';
        str += '<tbody>';
        players.forEach(p => {
            str += `<tr>
                                <td>${p.name}</td>
                                <td>${p.role}</td>
                                <td>${p.country}</td>
                                <td>${p.amount}</td>
                           </tr>
                         ` ;
        });

        str += '</tbody></table>';
    }
    playerData.innerHTML = str;

}

initTeamBasicDetails();
showTeamAmountStats();
showRoleAmountStats();


function drawPieChart(statData) {
    let arr = [['Team', 'Amount']];
    statData.forEach(ele => {
        arr.push([ele.label, ele.totalAmount])
    })
    var data = google.visualization.arrayToDataTable(arr);
    var options = {
        title: 'Role Amount Details'
    };
    var chart = new google.visualization.PieChart(document.getElementById('roleAmountChart'));
    chart.draw(data, options);
}

function drawColumnChart(statData) {
    let arr = [['Team', 'Amount']];
    statData.forEach(ele => {
        arr.push([ele.label, ele.totalAmount])
    })
    var data = google.visualization.arrayToDataTable(arr);
    var options = {
        title: 'Team Amount Details'
    };
    var chart = new google.visualization.ColumnChart(document.getElementById('amountStatChart'));
    chart.draw(data, options);
}

function getHeaders(method) {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log("{}", localStorage.getItem('token'));

    var requestOptions = {
        method: method,
        headers: myHeaders
    };
    return requestOptions;
}



logout.onclick = function () {
    if (jwt != null) {
        localStorage.removeItem('token');
        // localStorage.setItem('token',null);
        window.location.href = "login.html";
    }
}




