const urlBase = 'http://146.190.219.153/';
const extension = 'php';

async function GetContactInfo(contactID) {

    // Make a GET request to fetch contacts from the server
    const data = { ID: contactID };
    //console.log(data);
    const response = await fetch('http://146.190.219.153/LAMPAPI/GetContact.php', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const contactResponse = await response.json();
    //const contacts = JSON.parse(test);
    //console.log(contactResponse);
    //displayEditContactForm(contactResponse.results);
    //console.log(contactResponse.results.Name);
    document.getElementById("editName").value = contactResponse.results[0].Name;
    document.getElementById("editPhone").value = contactResponse.results[0].Phone;
    document.getElementById("editEmail").value = contactResponse.results[0].Email;
    document.getElementById("contactId").value = contactResponse.results[0].ID;
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function doEditContact()
{
    
    var name = document.getElementById("editName").value; 
    var phone = document.getElementById("editPhone").value;
    var email = document.getElementById("editEmail").value;
    var contactId = document.getElementById("contactId").value;
    let tmp = {
        name: name,
        phone: phone,
        email: email,
        id: contactId,
        userId:getCookie("userId")
    }
    console.log(tmp);
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + 'LAMPAPI/EditContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try{
        xhr.onreadystatechange = function (){
            if(this.readyState != 4){
                return;
            }
            if(this.status == 200){
                let jsonObject = JSON.parse(xhr.responseText);
                error = jsonObject.error;
                console.log(error);
                window.location.href = "contact.html";

            }
        };
        
        xhr.send(jsonPayload);
    } catch (err){
        
    }
}