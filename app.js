// contact class
class Contact {
  constructor(name, phone, email) {
    this.name = name;
    this.phone = phone;
    this.email = email;
  }
}
// UI class
class UI {
  addContactToList(contact) {
    const list = document.querySelector(".contact-list");
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${contact.name}</td>
    <td>${contact.phone}</td>
    <td>${contact.email}</td>
    <td><i class="fa fa-xmark text-danger delete-item"></i></td>
    `;
    list.appendChild(row);
  }
  showAlert(msg, classList) {
    const alertParent = document.querySelector("#alert-parent");
    const heading = document.querySelector("#heading");
    const alertDiv = document.createElement("div");
    alertDiv.classList.add(classList, "alert", "mt-3");
    alertDiv.innerText = msg;
    alertParent.insertBefore(alertDiv, heading);
    document.querySelector("#submit-btn").disabled = true;
    const ui = new UI();
    ui.clearFields();
    setTimeout(() => {
      document.querySelector("#submit-btn").disabled = false;
      alertDiv.remove();
    }, 3000);
  }
  clearFields() {
    document.querySelector("#name").value = "";
    document.querySelector("#phone").value = "";
    document.querySelector("#email").value = "";
  }
  removeContactItem(e) {
    if (e.target.classList.contains("delete-item")) {
      e.target.parentElement.parentElement.remove();
    }
  }
}
// localstore class to save changes in localstorage
class Localstore {
  // load contacts from localstorage
  static getContacts() {
    let contacts;
    if (localStorage.getItem("contacts") === null) {
      contacts = [];
    } else {
      contacts = JSON.parse(localStorage.getItem("contacts"));
    }
    return contacts;
  }
  // display contacts from localsotrage in the list
  static displayContacts() {
    const contacts = Localstore.getContacts();
    contacts.forEach((contact) => {
      const ui = new UI();
      ui.addContactToList(contact);
    });
  }
  // add new contact to the localstorage
  static addContact(contact) {
    const contacts = Localstore.getContacts();
    contacts.push(contact);
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }
  // remove contact from localstorage
  static removeContact(email) {
    const contacts = Localstore.getContacts();
    contacts.forEach(function (contact, index) {
      if (contact.email === email) {
        contacts.splice(index, 1);
      }
    });
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", Localstore.getContacts);
document.addEventListener("DOMContentLoaded", Localstore.displayContacts);
document
  .querySelector("#contact-form")
  .addEventListener("submit", function (e) {
    const name = document.querySelector("#name").value,
      phone = document.querySelector("#phone").value,
      email = document.querySelector("#email").value;
    const ui = new UI();
    if (name === "" || phone === "" || email === "") {
      ui.showAlert("Please fill all the fields", "alert-danger");
    } else {
      ui.showAlert("The new contact added", "alert-success");
      const contact = new Contact(name, phone, email);
      ui.addContactToList(contact);
      Localstore.addContact(contact);
    }

    e.preventDefault();
  });
document.querySelector(".contact-list").addEventListener("click", function (e) {
  const ui = new UI();
  ui.removeContactItem(e);
  Localstore.removeContact(
    e.target.parentElement.previousElementSibling.textContent
  );
});
