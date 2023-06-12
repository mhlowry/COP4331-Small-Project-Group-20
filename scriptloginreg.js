const urlBase = 'http://contactopia20.xyz';
const extension = 'php';

let userId = 0;
let firstname = "";
let lastname = "";
const id = []

/* TODO
 * add contact function
 * load contacts function
 * edit contact function
 * delete contact function
 * search contact function
*/ 

window.onload = function() {
    document.getElementById("loginbutton").addEventListener("click", function(event) {
      event.preventDefault();
      doLogin();
    });
  
    document.getElementById("registerbutton").addEventListener("click", function(event) {
      event.preventDefault();
      doRegister();
    });
  
    document.querySelector(".register-link").addEventListener('click', function(event) {
      event.preventDefault();
      toggleForm('register');
    });
  
    document.querySelector(".login-link").addEventListener('click', function(event) {
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
  



function doLogin(){
    userId = 0;
    firstname = "";
    lastname = "";

    let login = document.getElementById("loginname").value;
    let password = document.getElementById("loginpassword").value;

    if(!validLogin(login, password)){
        document.getElementById("loginresult").innerHTML = "invalid username/password";
        return;
    }
    
    document.getElementById("loginresult").innerHTML = "";

    let tmp = {login:login,password:password};

    let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
    try{
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200){
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1){
                    document.getElementById("loginresult").innerHTML = "Username/Password combination incorrect";
                    return;
                }

                firstname = jsonObject.firstname;
                lastname = jsonObject.lastname;

                saveCookie();
                window.location.href = "contact.html";
            }
        };

        xhr.send(jsonPayload);
    } catch (err){
        document.getElementById("loginresult").innerHTML = err.message;
    }
}

function doRegister(){
    firstname = document.getElementById("firstname").value;
    lastname = document.getElementById("lastname").value;

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if(!validRegister(firstname, lastname, username, password)){
        document.getElementById("registerresult").innerHTML = "invalid register";
        return;
    }

    document.getElementById("registerresult").innerHTML = "";

    let tmp = {
        firstname: firstname,
        lastname: lastname,
        login: username,
        password: password
    }

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try{
        xhr.onreadystatechange = function (){
            if(this.readyState != 4){
                return;
            }
            if(this.status == 409){
                document.getElementById("registerresult").innerHTML = "User already exists";
                return;
            }
            if(this.status == 200){
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                document.getElementById("registerresult").innerHTML = "User added";
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();
            }
        };
        
        xhr.send(jsonPayload);
    } catch (err){
        document.getElementById("registerresult").innerHTML = err.message;
    }
}

function saveCookie(){
    let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstname=" + firstname + ";lastname=" + lastname + ";userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstname" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastname" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "loginreg.html";
	}
	else
	{
		document.getElementById("username").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstname= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "loginreg.html";
}

function validLogin(login, pass){
    var loginerr = passerr = true;

    if(login == ""){
        console.log("USERNAME IS BLANK");
    }
    else{
        var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;

        if(regex.test(login) == false){
            console.log("INVALID USERNAME");
        }
        else{
            console.log("VALID USERNAME");
            loginerr = false;
        }
    }

    if(pass == ""){
        console.log("PASSWORD IS BLANK");
        passerr = true;
    }
    else{
        var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;

        if(regex.test(pass) == false){
            console.log("INVALID PASSWORD");
        }
        else{
            console.log("VALID PASSWORD");
            passerr = false;
        }
    }

    if((loginerr || passerr) == true){
        return false;
    }
    return true;
}

function validRegister(first, last, user, pass){
    var firsterr = lasterr = usererr = passerr = true;

    if(first == ""){
        console.log("FIRST NAME IS BLANK");
    }
    else{
        firsterr = false;
    }

    if(last == ""){
        console.log("LAST NAME IS BLANK");
    }
    else{
        lasterr = false;
    }

    if(user == ""){
        console.log("USERNAME IS BLANK");
    }
    else{
        var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;

        if(regex.test(user) == false){
            console.log("INVALID USERNAME");
        }
        else{
            console.log("VALID USERNAME");
            usererr = false;
        }
    }

    if(pass == ""){
        console.log("PASSWORD IS BLANK");
    }
    else{
        var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;

        if(regex.test(pass) == false){
            console.log("INVALID PASSWORD");
        }
        else{
            console.log("VALID PASSWORD");
            passerr = false;
        }
    }
    
    if((firsterr || lasterr || usererr || passerr) == true){
        return false;
    }

    return true;
}
