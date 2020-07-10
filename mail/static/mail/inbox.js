document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose').addEventListener('click', debug);
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  document.querySelector('#temp').innerHTML = '';
  document.querySelector('#arch').innerHTML = '';

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.querySelector('#compose').onclick = function() {debug() } ;

  //Wait for compose-form button to be clicked, get the data from them, move them into variables for send_email func
 
  document.querySelector('#compose-form').onsubmit = function () {
    get_data();
  };
  
 // });
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  

  if (mailbox == 'inbox'){

    document.querySelector('#temp').innerHTML = '';
    document.querySelector('#arch').innerHTML = '';

    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
     // Print emails
     console.log(emails[0]);
 for ( x = 0; x < emails.length ; x++) {
     email = emails[x];
 DisplayEmails(email);
           } //endfor
      })//end 2nd .then
    }
   
    if (mailbox == 'archive') {
      document.querySelector('#temp').innerHTML = '';
      document.querySelector('#arch').innerHTML = '';
 //stuff to do with the archive emails


        fetch('/emails/archive')
        .then(response => response.json())
        .then(emails => {
          for ( x = 0; x < emails.length ; x++) {
            email = emails[x];
            DisplayEmails(email);
            //end fetch
         }//END FOR - for each fetched email, append that to the div
        })

      }

    if (mailbox == 'sent') {
      document.querySelector('#temp').innerHTML = '';
      document.querySelector('#arch').innerHTML = '';
     //stuff to do with sent emails
       fetch('/emails/sent')
      .then(response => response.json())
      .then(emails => {
        for (x = 0; x < emails.length ; x++){
        email = emails[x];
        DisplayEmails(email);
        } //end for
    })
  }
}

function debug() {
  console.log("DEBUG !");
}

function get_data() {
 const newRecipient =  document.querySelector('#compose-recipients').value;
  const newSubject = document.querySelector('#compose-subject').value;
 const newBody = document.querySelector('#compose-body').value;
  
  send_email(newRecipient, newSubject, newBody);
}

function send_email (recipients, subject, body) {
  alert(recipients+ subject+ body + "Pre-fetch");
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      alert(result + "post fetch");
  });
  alert("A");
}

function DisplayEmails(email) {
  CreateNewEmailSection(email);//creates newEmail div
  document.querySelector('#temp').append(newEmail);
  CreateShowEmailSection(email); //creates the showEmail div - displays the body of email, display is defaulted to none
  //CreateArchiveButton(email); //makes the archive button
  NewListener(email); //applied an event listener to the newEmail div to change showEmail div to block on click
     document.querySelector('#temp').append(newEmail); 
}

function CreateNewEmailSection (email) {
newEmail = document.createElement('div');
newEmail.setAttribute("id", "newEmail" + email.id );

if (email.read == true) {
  newEmail.setAttribute('style', 'background-color: lightgray;border-style: solid;padding: 10px;margin: 10px;');
}
else {
  newEmail.setAttribute('style', 'background-color: whiteborder-style: solid;padding: 10px;margin: 10px;');
}
newEmail.innerHTML = //this inner HTML shows the overview of the email, newEmail is the 'wrapper' for the full email.

  `<p> <b>Sender: </b> ${email.sender} <b> Recipient: </b>${email.recipients} <b> Subject: </b>${email.subject}, <b> Time Sent: </b>${email.timestamp} </p>`;
}

function CreateShowEmailSection(email) { //showEmail is seperate to newEmail so I can have the email body hidden by default.
  showEmail = document.createElement('div');
          showEmail.setAttribute('id', 'showEmail' + email.id);
          showEmail.setAttribute('style', 'background-color: antiquewhite')
          showEmail.innerHTML = email.body; //gets the body of the email from the for loop .body
          showEmail.style.display='none';//hides it by default
          newEmail.append(showEmail);
}

function CreateArchiveButton(email) {
  const archiveButton = document.createElement('button');
  console.log(email.id + "WOI");
  archiveButton.innerHTML = 'Archive Email';
  archiveButton.onclick = function () {
    alert(email.id);
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
  }
  showEmail.append(archiveButton);
}
function CreateUnArchiveButton(email) {
  const archiveButton = document.createElement('button');
 
  archiveButton.innerHTML = 'UnArchive Email';
  archiveButton.onclick = function () {
    alert(email.id);
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })
  }
  showEmail.append(archiveButton);
}

function NewListener (email) {
  console.log(document.querySelector(`#showEmail${email.id}`).style.display);
  newEmail.addEventListener('click', function() { //allows clicking on the email to display the body
    if (document.querySelector(`#showEmail${email.id}`).style.display === 'none'){
      document.querySelector(`#showEmail${email.id}`).style.display = 'block';
      ////////////////fetch email //////////////////////sets 'read' to true when email is read
      fetch(`/emails/${email.id}`, { 
        method: 'PUT',
        body: JSON.stringify({
            read: true })
      })
      /////////////////end fetch ////////////////////
      }
      else {
        document.querySelector(`#showEmail${email.id}`).style.display = 'none';
      }
  });
  
}