
const register = document.getElementById("register");
let message = document.getElementById("message");
let message2 = document.getElementById("message2");
message.style.visibility = 'hidden';
register.onclick = function register() {
  console.log("Login")
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const mail = document.getElementById("gmail").value;
  var myHeaders = new Headers();
  if (user != null && password != null) {
    raw = JSON.stringify({
      "username": username,
      "password": password,
      "email": mail + 'gmail.com'
    });

    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };

    fetch("https://iplstatsapp.onrender.com/iplstats/api/auth/register", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        message2.innerHTML = `User created with username : ${username}`;
      })
      .catch(error => console.log('error', error));
  } else {
    message.style.visibility = 'visible';
    message.style.color = 'red';
    message.innerHTML = "Entered credentials are not valid";
  }

}