
const register = document.getElementById("register");
let message = document.getElementById("message");
message.style.visibility = 'hidden';
register.onclick = function register() {
  console.log("Login")
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value; 
  const mail = document.getElementById("gmail").value;
  var myHeaders = new Headers();
  var raw ={};
  if(user != null && password !=null){
    raw = JSON.stringify({
      "username": username,
      "password": password,
      "email": mail
    });
  }else {
    message.style.visibility = 'visible';
    message.style.color = 'red';
    message.innerHTML = "Entered credentials are not valid";
  }
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
      localStorage.setItem('token', result.jwt);
      console.log(result)
    }
    )
    .catch(error => console.log('error', error));
}