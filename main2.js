var jwt = localStorage.getItem("token");
if (jwt == null) {
  window.location.href = "login.html";
}

let teamSelectIds = document.querySelector("#teamSelectIds"); 
let teamRoleDetails = document.getElementById("teamRoleDetails");
let teamCountryDetails = document.getElementById("teamCountryDetails");
const selectRole = document.getElementById("selectRole");
const selectCountry = document.getElementById("selectCountry");
const playerRoleDetailsTable = document.getElementById("playerRoleDetailsTable");
const playerCountryDetailsTable = document.getElementById("playerCountryDetailsTable");
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


function getOptions(method) {
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

function initTeamBasicDetails() {
  var requestOptions = getOptions('GET');
  fetch(`${baseUrl}/team/basic-details`, requestOptions).then(res => res.json()).then(data => {
    let teamBasicDetails = data;
    showDropdownValues(teamBasicDetails);
    showDropdownValues1(teamBasicDetails);
    showDropdownValuesOdTeamforRoles(teamBasicDetails);
  }).catch(error => {
    console.log(error);
  })
}

// drop down options 

function showDropdownValues(teamBasicDetails) {
  let str = `<select class="form-select" id='selectedTeamIdRole' onchange='showTeamRoleStats(); showTeamCountryStats(); initRoleForPlayer(); initCountryForPlayer(); '>
      <option selected value=''>Select team</option>`;
  for (let i = 0; i < teamBasicDetails.length; i++) {
    team = teamBasicDetails[i];
    str += `<option value=${team.id}>${team.label} - <i>${team.name}</i></option>`
  }
  str += '</select>';
  teamSelectIds.innerHTML = str;
}


// for charts 

function showTeamRoleStats() {
  var requestOptions = getOptions('GET');
  let teamId = document.querySelector('#selectedTeamIdRole').value;
  fetch(`${baseUrl}/stats/team-role-stats/${teamId}`, requestOptions).then(res => res.json()).then(data => {
    drawColumnCharts1(data);
  }).catch(error => {
    console.log(error);
  })
}


function drawColumnCharts1(statData) {
  let arr = [['Role', 'Amount']];
  statData.forEach(ele => {
    arr.push([ele.role, ele.totalAmount])
  })
  let rolesArray = [['Role']];
  statData.forEach(ele => { rolesArray.push([ele.role]) });
  var data = google.visualization.arrayToDataTable(arr);
  var options = {
    title: 'Team/Role Amount Details'
  };
  var chart = new google.visualization.ColumnChart(document.getElementById("teamRoleDetails"));
  chart.draw(data, options);
}


function showTeamCountryStats() {
  var requestOptions1 = getOptions('GET');
  let teamId1 = document.querySelector('#selectedTeamIdRole').value;
  fetch(`${baseUrl}/stats/team-country-stats/${teamId1}`, requestOptions1).then(res => res.json()).then(data => {
    google.charts.setOnLoadCallback(drawPieChart1(data));
    let teamBasicDetails = data;
    showDropdownValuesForRole(teamBasicDetails);
  }).catch(error => {
    console.log(error);
  })
}
function drawPieChart1(statData) {
  let arr = [['Country', 'Amount']];
  statData.forEach(ele => {
    arr.push([ele.country, ele.totalAmount])
  })
  var data = google.visualization.arrayToDataTable(arr);
  var options = {
    title: 'Team/Country Amount Details'
  };
  var chart = new google.visualization.PieChart(document.getElementById('teamCountryDetails'));
  chart.draw(data, options);
}

// for players tables for role

function initRoleForPlayer() {
  var requestOptions = getOptions('GET');
  let teamId = document.querySelector('#selectedTeamIdRole').value;
  fetch(`${baseUrl}/player/${teamId}/roles`, requestOptions).then(res => res.json()).then(data => {
    showDropdownValuesForRole(data);
  }).catch(error => {
    console.log(error);
  })
}

function showDropdownValuesForRole(rolesofTeam) {
  let str = `<select class="form-select" id='selectedRole' onchange='showPlayerOfRoleDetails()'>
  <option selected value=''>Select role</option>`;
  for (let i = 0; i < rolesofTeam.length; i++) {
    roleT = rolesofTeam[i];
    str += `<option value=${roleT.role}>${roleT.role}</option>`
    console.log(roleT.role);
  }
  str += '</select>';
  selectRole.innerHTML = str;
}


function showPlayerOfRoleDetails() {
  let teamId = document.querySelector('#selectedTeamIdRole').value;
  let role = document.querySelector('#selectedRole').value;
  if (teamId !== "") {
    var requestOptions = getOptions('GET')
    fetch(`${baseUrl}/stats/${teamId}/player-team-role/${role}`, requestOptions).then(res => res.json()).then(data => {
      viewPlayerTRoleDetails(data);
    }).catch(error => {
      console.log(error);
    })
  }

}

function viewPlayerTRoleDetails(players) {
  if(players != null){
    let str = "There is no player data on given role in a selected team";
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
  playerRoleDetailsTable.innerHTML = str;
  } else{
    playerRoleDetailsTable.innerHTML = "There is no player data on given role in a selected team"
  }
  

}

// player details for country 

function initCountryForPlayer() {
  var requestOptions = getOptions('GET');
  let teamId = document.querySelector('#selectedTeamIdRole').value;
  fetch(`${baseUrl}/player/${teamId}/country`, requestOptions).then(res => res.json()).then(data => {
    showDropdownValuesForCountry(data);
  }).catch(error => {
    console.log(error);
  })
}

function showDropdownValuesForCountry(countriesofTeam) {
  let str = `<select class="form-select" id='selectedCountry' onchange='showPlayerOfCountryDetails()'>
  <option selected value=''>Select country</option>`;
  for (let i = 0; i < countriesofTeam.length; i++) {
    countries = countriesofTeam[i];
    str += `<option value=${countries.country}>${countries.country}</option>`
    console.log(countries.role);
  }
  str += '</select>';
  selectCountry.innerHTML = str;
}


function showPlayerOfCountryDetails() {
  let teamId = document.querySelector('#selectedTeamIdRole').value;
  let country = document.querySelector('#selectedCountry').value;
  if (teamId !== "") {
    var requestOptions = getOptions('GET')
    fetch(`${baseUrl}/stats/${teamId}/player-team-country/${country}`, requestOptions).then(res => res.json()).then(data => {
      viewPlayerCountryDetails(data);
    }).catch(error => {
      console.log(error);
    })
  }
}

function viewPlayerCountryDetails(players) {

  if(players != null){
    let str = "There is no player data on given country name in selected team";
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
    playerCountryDetailsTable.innerHTML = str;
  }
  else {
    playerCountryDetailsTable.innerHTML = "There is no player data on given country name in selected team"
  }

}



logout.onclick = function () {
  if (jwt != null) {
    localStorage.removeItem('token');
    // localStorage.setItem('token',null);
    window.location.href = "login.html";
  }
}


initTeamBasicDetails();

initRoleForPlayer();
showPlayerOfRoleDetails();

showTeamRoleStats();

initCountryForPlayer();
showPlayerOfCountryDetails();


