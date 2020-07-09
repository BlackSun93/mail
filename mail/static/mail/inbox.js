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

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.querySelector('#compose').onclick = function() {debug() } ;

  //Wait for compose-form button to be clicked, get the data from them, move them into variables for send_email func
  //these are no longer running
  //document.addEventListener('DOMContentLoaded', function() {
  //document.querySelector('#compose-form').onsubmit = get_data;
  document.querySelector('#compose-form').onsubmit = function () {
    /*const newRecipient = document.querySelector('#compose-recipients').value;
    const newSubject = document.querySelector('#compose-subject').value;
    const newBody = document.querySelector('#compose-body').value;*/
    get_data();
    //console.log(`hello ${newRecipient} ${newSubject} ${newBody} !`);
    send_email(newRecipient, newSubject, newBody); 
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
    fetch('/emails/inbox')
    
    .then(response => response.json())
    .then(emails => {
     // Print emails
     console.log(emails);
     console.log(emails[0]);
     
     
      for ( x = 0; x < emails.length ; x++) {
        //alert(emails[x].id);
        const eID = new Number(emails[x].id); //get each email's unique ID
        
        //alert("EID is" + eID);
        //var = emails[x].id;
        newEmail = document.createElement('div');
        newEmail.setAttribute("id", "newEmail" + eID );
        newEmail.innerHTML = //if emails[x][read] == true bckgrnd color = white else grey
        //this inner HTML shows the overview of the email, newEmail is the 'wrapper' for the full email.
         `<p> <b>Sender: </b> ${emails[x]['sender']} </p>
          <p> <b> Subject: </b>   ${emails[x]['subject']}</p> 
          <p> <b> Time Sent: </b>${emails[x]['timestamp']} </p>`;
          const thisEmailID = newEmail.id; //this makes sure the id for each div is different (they were all setting to 1)
          //showEmail contains the email body, seperated to allow control over its display property
          showEmail = document.createElement('div');
          showEmail.setAttribute('id', 'showEmail' + eID);
          showEmail.setAttribute('class', 'email'); //not needed
          showEmail.innerHTML = `${emails[x].body}`; //gets the body of the email from the for loop .body
          showEmail.style.display='none';//hides it by default
          const showEmailID = showEmail.id; //gives this section an ID related to the email id
          const archiveButton = document.createElement('button');
          archiveButton.innerHTML = 'Archive Email';
          archiveButton.onclick = function () {
            fetch(`/emails/${eID}`, {
              method: 'PUT',
              body: JSON.stringify({
                  archived: true
              })
            })
          }
          showEmail.append(archiveButton); //adds a button to allow archiving, TODO: make this a sep function
       
          newEmail.addEventListener('click', function() { //allows clicking on the email to display the body
            if (document.querySelector(`#${showEmailID}`).style.display === 'none'){
              document.querySelector(`#${showEmailID}`).style.display = 'block';
              fetch(`/emails/${eID}`, { //sets 'read' to true when email is read
                method: 'PUT',
                body: JSON.stringify({
                    read: true
                })
              })
              
              }
              else {
                document.querySelector(`#${showEmailID}`).style.display = 'none';
              }
          });
         
          document.querySelector('#show-mails').append(newEmail); 
          newEmail.append(showEmail); //inbox has a show mails div, emails are appended to this, show email is appended to
          //new email TODO make this one??
 
          } //endfor
      })//end 2nd .then
    }
    
  


    if (mailbox == 'archive') {
 //stuff to do with the archive emails
 fetch('/emails/archive')
 .then(response => response.json())
 .then(emails => {
  for ( x = 0; x < emails.length ; x++) {
    //alert(emails[x].id);
    const eID = new Number(emails[x].id); //get each email's unique ID
    
    //alert("EID is" + eID);
    //var = emails[x].id;
    newEmail = document.createElement('div');
    newEmail.setAttribute("id", "newEmail" + eID );
    newEmail.innerHTML = emails[x].body;
    document.querySelector('#show-mails').append(newEmail);
  }
  // Print emails
  console.log(emails);
    })
  }



    if (mailbox == 'sent') {
     //stuff to do with sent emails
     fetch('/emails/sent')
     .then(response => response.json())
     .then(emails => {
      // Print emails
      console.log(emails); 
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




