const register = document.getElementById("register");
let message = document.getElementById("message");
const message2 = document.getElementById("message2");
const user = document.getElementById("user");
const roleuser = document.getElementById("roleuser");
const navbarR = document.getElementById("navbarR");

var jwt = localStorage.getItem("token");
if (jwt == null) {
  window.location.href = "login.html";
  navbarR.style.visibility = 'hidden';
} else {
  user.innerHTML = parseJwt(jwt).sub;
  role.innerHTML = `(${parseJwt(jwt).roles[0]})`;
  roleuser.style.visibility = 'visible';
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}


register.onclick = function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;
  const role = document.getElementById("role");
  if (username !== null && password !== null && parseJwt(jwt).role[0] == "ADMIN") {
    role.style.visibility = 'visible';
    var myHeaders = new Headers();
    raw = JSON.stringify({
      "username": username,
      "password": password,
      "email": email,
      "role": role
    });

    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };

    fetch("https://iplstatsapp.onrender.com/iplstats/api/auth/register", requestOptions)
      .then(response => console.log(response))
      .catch(error => console.log('error', error));
    message2.innerHTML = `User created with user name: ${username}`;
  } else {
    role.style.visibility = 'hidden';
    message2.style.visibility = 'hidden';
    message.style.visibility = 'visible';
    message.style.color = 'red';
    message.innerHTML = "Entered credentials are not valid";
  }

}