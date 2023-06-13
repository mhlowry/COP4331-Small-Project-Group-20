const urlBase = 'http://146.190.219.153/';
const extension = 'php';


document.addEventListener("DOMContentLoaded", function () {
    // Fetch and display contacts on page load
    fetchContacts(getCookie("userId"));

});

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

async function fetchContacts(id) {

    // Make a GET request to fetch contacts from the server
    const data = { userId: id };
    console.log(data);
    const response = await fetch('http://146.190.219.153/LAMPAPI/SearchContacts.php', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const test = await response.json();
    //const contacts = JSON.parse(test);
    console.log(test);
    displayContacts(test.results);
}
function doSearch(){
    var keyword = document.getElementById("searchKeyword").value; 

    searchContacts(keyword);

}
async function searchContacts(keyword) {

    // Make a GET request to fetch contacts from the server
    const data = { userId: getCookie("userId"),keyword:keyword };
    console.log(data);
    const response = await fetch('http://146.190.219.153/LAMPAPI/SearchContacts.php', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const test = await response.json();
    //const contacts = JSON.parse(test);
    console.log(test);
    displayContacts(test.results);
}

function displayContacts(contacts) {
    const contactsList = document.getElementById("contactsList");

    // Clear the contacts list before adding new contacts
    contactsList.innerHTML = "";

    // Loop through each contact and create HTML elements to display them
    contacts.forEach(contact => {
        const contactCard = document.createElement("div");
        contactCard.classList.add("contact-card");

        const name = document.createElement("h2");
        name.textContent = contact.Name;
        contactCard.appendChild(name);

        const editButton= document.createElement('button')
        editButton.innerText= 'Edit'
        editButton.addEventListener("click", function(e){
            //console.log(contact.ID);
            showEditForm(contact.ID);

        });
        contactCard.appendChild(editButton);

        const deleteButton= document.createElement('button')
        deleteButton.innerText= 'Delete'
        deleteButton.addEventListener("click", function(e){
            //console.log(contact.ID);
            deleteContact(contact.ID);
            
        });
        contactCard.appendChild(deleteButton);
        

        const phone = document.createElement("p");
        phone.textContent = "Phone: " + contact.Phone;
        contactCard.appendChild(phone);

        const email = document.createElement("p");
        email.textContent = "Email: " + contact.Email;
        contactCard.appendChild(email);

        contactsList.appendChild(contactCard);
    });
}
function showEditForm(contactId)
{
    let minutes = 40;
    let date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000));	
    document.cookie = "editContactId=" + contactId + ";expires=" + date.toGMTString();

    window.location.href = "editContact.html";
}
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
function doEditContact()
{
    
    const name = document.getElementById("editName").value; 
    const phone = document.getElementById("editPhone").value;
    const email = document.getElementById("editEmail").value;
    const contactId = document.getElementById("contactId").value;
    console.log(contactId);
    contactId = 2;
    console.log(contactId);

    name = "tom2";
    phone = "phone2";
    email = "email2";

    let tmp = {
        name: name,
        phone: phone,
        email: email,
        id: contactId
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
                //window.location.href = "contact.html";

            }
        };
        
        xhr.send(jsonPayload);
    } catch (err){
        
    }
}
function deleteContact(contactId)
{
    let tmp = {
        ID: contactId
    }

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + 'LAMPAPI/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try{
        xhr.onreadystatechange = function (){
            if(this.readyState != 4){
                return;
            }
        };
        
        xhr.send(jsonPayload);
    } catch (err){

    }
    window.location.href = "contact.html";
}
function doAddContact()
{
    name = document.getElementById("name").value;
    phone = document.getElementById("phone").value;
    email = document.getElementById("email").value;

    if(name == "")
    {
        document.getElementById("addContactResult").innerHTML = "name cannot be empty";
    }
    else if(phone == "")
    {
        document.getElementById("addContactResult").innerHTML = "phone number cannot be empty";
    }
    else if(email == "")
    {
        document.getElementById("addContactResult").innerHTML = "email cannot be empty";
    }
    else
    {
        document.getElementById("addContactResult").innerHTML = "";
        let tmp = {
            name: name,
            phone: phone,
            email: email,
            userID: getCookie("userId")
        }
    
        let jsonPayload = JSON.stringify(tmp);
    
        let url = urlBase + 'LAMPAPI/AddContact.' + extension;
    
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
                    if(error == "")
                    {
                        document.getElementById("addContactResult").innerHTML = "Contact added";
                    }
                    else
                    {
                        document.getElementById("addContactResult").innerHTML = "Contact already exists";
                    }
    
                }
            };
            
            xhr.send(jsonPayload);
        } catch (err){
            document.getElementById("addContactResult").innerHTML = err.message;
        }
    }


}