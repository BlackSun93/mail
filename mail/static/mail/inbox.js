document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  document.querySelector('#emailInfo').innerHTML = '';
  document.querySelector('#displayEmailBody').innerHTML = '';
  
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  //Wait for compose-form button to be clicked, get the data from them, move them into variables for send_email func
 
  document.querySelector('#compose-form').onsubmit = function () {
    get_data();
  };
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  displayEmailBody.innerHTML = '';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  document.querySelector('#emailInfo').innerHTML = '';

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
     // Print emails
  for ( x = 0; x < emails.length ; x++) {
    email = emails[x];
    DisplayEmails(email);
        } 
      })
    }

function get_data() {
  const newRecipient =  document.querySelector('#compose-recipients').value;
  const newSubject = document.querySelector('#compose-subject').value;
  const newBody = document.querySelector('#compose-body').value;
  send_email(newRecipient, newSubject, newBody);
}

function send_email (recipients, subject, body) {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json());
}

function DisplayEmails(email) {
  CreateNewEmailSection(email);//creates newEmail div
  document.querySelector('#emailInfo').append(newEmail);
  //CreateShowEmailSection(email); //creates the showEmail div - displays the body of email, display is defaulted to none
  NewListener(email); //applied an event listener to the newEmail div to change showEmail div to block on click
  document.querySelector('#emailInfo').append(newEmail); 
}

function CreateNewEmailSection (email) {
  newEmail = document.createElement('div');
  newEmail.setAttribute("id", "newEmail" + email.id );

  if (email.read == true) {
   newEmail.setAttribute('style', 'background-color: rgb(224, 224, 224);border-style: solid; border-color: rgb(119, 205, 245);padding: 10px;margin: 10px;');
  }
  else {
    newEmail.setAttribute('style', 'background-color: whiteborder-style: solid;padding: 10px;margin: 10px; border-style: solid; border-color: rgb(119, 205, 245);padding: 10px;margin: 10px;');
  }
  newEmail.innerHTML = `<p> <b>Sender: </b> ${email.sender}  <b> Subject: </b>${email.subject}, <b> Time Sent: </b>${email.timestamp} </p>`;
  //this inner HTML shows the overview of the email, newEmail is the 'wrapper' for the full email.
}

function CreateReplyButton(email) {                     //makes the reply button, gives it an onclick function and appends it to displayEmailBody
  const replyButton = document.createElement('button');
  replyButton.setAttribute('class', 'btn btn-sm btn-outline-primary');
  replyButton.setAttribute( 'id', 'repyBtn' + `${email.id}`);
 
  replyButton.innerHTML = 'reply';
  
  replyButton.onclick = function () {
  displayEmailBody.style.display = 'none'; //hides other views and the selected email's body
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // prefill fields with information from selected email
  document.querySelector('#compose-recipients').value = email.sender;
  document.querySelector('#compose-subject').value = 'RE: ' + email.subject;
  document.querySelector('#compose-body').value = email.sender + ' at ' + email.timestamp + ' Wrote : ' + email.body;
  document.querySelector('#compose-form').onsubmit = function () {
    get_data();
  };
  }
  displayEmailBody.append(replyButton);
}

function NewListener (email) {
  newEmail.addEventListener('click', function() { //allows clicking on the email to display the body
    ///////////////// fetch ////////////////////
    fetch(`/emails/${email.id}`, { 
      method: 'PUT',
      body: JSON.stringify({
          read: true })
    })
    /////////////////end fetch ////////////////////
  DisplayEmailBody(email);
  
  });
}

function DisplayEmailBody (email) { 
  document.querySelector('#emailInfo').innerHTML = '';
                                                  //displayEmailBody is div in inbox.html
  displayEmailBody.innerHTML = ` 
  <p>Sender: <b> ${email.sender} </b> </p>
  <p>Subject: <b> ${email.subject} </b> </p>
  <p>Time: <b> ${email.timestamp} </b> </p>
  <p>Body: <b> ${email.body} </b> </p>`;
  CreateReplyButton(email);
  CreateArchiveButton(email); //makes the archive button
  
}

function CreateArchiveButton(email) {
  const archiveButton = document.createElement('button');
  archiveButton.setAttribute('class', 'btn btn-sm btn-outline-primary');
  if (email.archived == false) {
    archiveButton.innerHTML = 'Archive';
  archiveButton.onclick = function () {
    
      alert('Email Archived');
      fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
    load_mailbox('inbox');
  } 
  displayEmailBody.append(archiveButton);
}
  else {
    archiveButton.innerHTML = 'UnArchive';
    archiveButton.onclick = function () {
  
    alert('Email unarchived');
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
        })
      })
      load_mailbox('inbox');
    }
    displayEmailBody.append(archiveButton);
  }
}