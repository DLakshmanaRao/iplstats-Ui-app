
const register = document.getElementById("register");
let message = document.getElementById("message");
const message2 = document.getElementById("message2")
register.onclick = function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;
  if (username !== null && password !== null) {
    var myHeaders = new Headers();
    raw = JSON.stringify({
      "username": username,
      "password": password,
      "email": email
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
    message2.style.visibility = 'hidden';
    message.style.visibility = 'visible';
    message.style.color = 'red';
    message.innerHTML = "Entered credentials are not valid";
  }

}