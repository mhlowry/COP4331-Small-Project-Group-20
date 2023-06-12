const urlBase = 'http://contactopia20.xyz';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

window.onload = function () {
    document.getElementById("loginbutton").addEventListener("click", function (event) {
      event.preventDefault();
      if (validLogin()) {
        doLogin();
      }
    });
  
    document.getElementById("registerbutton").addEventListener("click", function (event) {
      event.preventDefault();
      if (validRegister()) {
        doRegister();
      }
    });

  document.querySelector(".register-link").addEventListener('click', function (event) {
    event.preventDefault();
    toggleForm('register');
  });

  document.querySelector(".login-link").addEventListener('click', function (event) {
    event.preventDefault();
    toggleForm('login');
  });
};

function toggleForm(formType) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (formType === 'register') {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  } else if (formType === 'login') {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
  }
}

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";
  
    let login = document.getElementById("loginname").value;
    let password = document.getElementById("loginpassword").value;
  
    if (!validLogin(login, password)) {
      document.getElementById("loginresult").innerHTML = "Invalid username/password";
      return;
    }
  
    document.getElementById("loginresult").innerHTML = "";
  
    let tmp = { login: login, password: password };
    let jsonPayload = JSON.stringify(tmp);
  
    let url = urlBase + '/Login.' + extension;
  
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        console.log("Response status:", xhr.status);
        console.log("Response text:", xhr.responseText);
  
        if (xhr.status == 200) {
          let jsonObject = JSON.parse(xhr.responseText);
          userId = jsonObject.id;
  
          if (userId < 1) {
            document.getElementById("loginresult").innerHTML = "No account found with the provided login details";
          } else {
            firstName = jsonObject.firstName;
            lastName = jsonObject.lastName;
  
            saveCookie();
            window.location.href = "contact.html";
          }
        } else if (xhr.status == 401) {
          document.getElementById("loginresult").innerHTML = "Invalid username/password";
        } else {
          document.getElementById("loginresult").innerHTML = "An error occurred during the login process";
        }
      }
    };
  
    xhr.send(jsonPayload);
  }  
  

function doRegister() {
  firstName = document.getElementById("firstname").value;
  lastName = document.getElementById("lastname").value;
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if (!validRegister(firstName, lastName, username, password)) {
    document.getElementById("registerresult").innerHTML = "Invalid registration details";
    return;
  }

  document.getElementById("registerresult").innerHTML = ""; // Clear previous error message

  let tmp = {
    firstName: firstName,
    lastName: lastName,
    login: username,
    password: password
  };

  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + '/RegisterUser.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;
        document.getElementById("registerresult").innerHTML = "User added";
        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;
        saveCookie();
      } else if (xhr.status === 409) {
        document.getElementById("registerresult").innerHTML = "User already exists";
      } else {
        document.getElementById("registerresult").innerHTML = "Registration failed";
      }
    }
  };

  xhr.send(jsonPayload);
}

function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie = "firstname=" + firstName + ";lastname=" + lastName + ";userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "firstname") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastname") {
      lastName = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    window.location.href = "loginreg.html";
  } else {
    document.getElementById("username").innerHTML = "Logged in as " + firstName + " " + lastName;
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstname= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "loginreg.html";
}

function validLogin(login, pass) {
    
    var loginerr = passerr = false;
  
    var loginInput = document.getElementById("loginname");
    var passInput = document.getElementById("loginpassword");
    var loginLabel = document.querySelector("label[for='loginname']");
    var passLabel = document.querySelector("label[for='loginpassword']");

    console.log(loginLabel); // Debugging statement
    console.log(passLabel); // Debugging statement
  
    if (login === "") {
      console.log("USERNAME IS BLANK");
      loginerr = true;
      loginLabel.innerHTML += " *";
    } else {
      var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;
  
      if (regex.test(login) === false) {
        console.log("INVALID USERNAME");
        loginerr = true;
        loginLabel.innerHTML += " *";
      } else {
        console.log("VALID USERNAME");
      }
    }
  
    if (pass === "") {
      console.log("PASSWORD IS BLANK");
      passerr = true;
      passLabel.innerHTML += " *";
    } else {
      var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;
  
      if (regex.test(pass) === false) {
        console.log("INVALID PASSWORD");
        passerr = true;
        passLabel.innerHTML += " *";
      } else {
        console.log("VALID PASSWORD");
      }
    }
  
    if (loginerr) {
      loginInput.classList.add("input-error");
    } else {
      loginInput.classList.remove("input-error");
      loginLabel.innerHTML = "Login";
    }
  
    if (passerr) {
      passInput.classList.add("input-error");
    } else {
      passInput.classList.remove("input-error");
      passLabel.innerHTML = "Password";
    }
  
    if (loginerr || passerr) {
      return false;
    }
    return true;
  }
  
  function validRegister(first, last, user, pass) {
    var firsterr = lasterr = usererr = passerr = true;
  
    if (first === "") {
      console.log("FIRST NAME IS BLANK");
      document.querySelector("label[for='firstname']").innerHTML += " *";
    } else {
      firsterr = false;
    }
  
    if (last === "") {
      console.log("LAST NAME IS BLANK");
      document.querySelector("label[for='lastname']").innerHTML += " *";
    } else {
      lasterr = false;
    }
  
    if (user === "") {
      console.log("USERNAME IS BLANK");
      document.querySelector("label[for='username']").innerHTML += " *";
    } else {
      var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;
  
      if (regex.test(user) === false) {
        console.log("INVALID USERNAME");
        usererr = true;
        document.querySelector("label[for='username']").innerHTML += " *";
      } else {
        console.log("VALID USERNAME");
      }
    }
  
    if (pass === "") {
      console.log("PASSWORD IS BLANK");
      document.querySelector("label[for='password']").innerHTML += " *";
    } else {
      var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;
  
      if (regex.test(pass) === false) {
        console.log("INVALID PASSWORD");
        passerr = true;
        document.querySelector("label[for='password']").innerHTML += " *";
      } else {
        console.log("VALID PASSWORD");
      }
    }
  
    if (firsterr) {
      document.getElementById("firstname").classList.add("input-error");
    } else {
      document.getElementById("firstname").classList.remove("input-error");
      document.querySelector("label[for='firstname']").innerHTML = "First Name";
    }
  
    if (lasterr) {
      document.getElementById("lastname").classList.add("input-error");
    } else {
      document.getElementById("lastname").classList.remove("input-error");
      document.querySelector("label[for='lastname']").innerHTML = "Last Name";
    }
  
    if (usererr) {
      document.getElementById("username").classList.add("input-error");
    } else {
      document.getElementById("username").classList.remove("input-error");
      document.querySelector("label[for='username']").innerHTML = "Username";
    }
  
    if (passerr) {
      document.getElementById("password").classList.add("input-error");
    } else {
      document.getElementById("password").classList.remove("input-error");
      document.querySelector("label[for='password']").innerHTML = "Password";
    }
  
    if (firsterr || lasterr || usererr || passerr) {
      return false;
    }
    return true;
  }
  