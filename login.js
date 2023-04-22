var jwt = localStorage.getItem("token");
if (jwt != null) {
  window.location.href = "index.html";
}

const login = document.getElementById("login");
login.onclick = function login() {
  console.log("Login")
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    "username": username,
    "password": password
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw
  };

  fetch("https://iplstatsapp.onrender.com/iplstats/api/auth/login", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result);
      localStorage.setItem('token', result.jwt);
      console.log(result)
      window.location.href = "index.html";
    }
    )
    .catch(error => console.log('error', error));
}