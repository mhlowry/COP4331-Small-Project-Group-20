document.addEventListener("DOMContentLoaded", function() {
  // Fetch and display contacts on page load
  fetchContacts();
});

function fetchContacts() {
  // Make a GET request to fetch contacts from the server
  fetch("http://contactopia20.xyz/LAMPAPI/SearchContacts.php")
    .then(response => response.json())
    .then(data => {
      // Call a function to display the contacts
      displayContacts(data);
    })
    .catch(error => {
      console.log("An error occurred while fetching contacts:", error);
    });
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
    name.textContent = contact.name;
    contactCard.appendChild(name);

    const phone = document.createElement("p");
    phone.textContent = "Phone: " + contact.phone;
    contactCard.appendChild(phone);

    const email = document.createElement("p");
    email.textContent = "Email: " + contact.email;
    contactCard.appendChild(email);

    contactsList.appendChild(contactCard);
  });
}
