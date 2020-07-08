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
        alert(emails[x].id);
        var eID = new Number(emails[x].id);
        
        alert("EID is" + eID);
        //var = emails[x].id;
        newEmail = document.createElement('div');
        newEmail.setAttribute("id", "newEmail" + x );
        newEmail.innerHTML = //if emails[x][read] == true bckgrnd color = white else grey
         `<p> <b>Sender: </b> ${emails[x]['sender']} </p>
          <p> <b> Subject: </b>   ${emails[x]['subject']}</p> 
          <p> <b> Time Sent: </b>${emails[x]['timestamp']} </p>
          `;
          newEmail.addEventListener('click', function() {
            //var = `${emails[x]['id']}`;
            
            get_email(eID);
              console.log('This element has been clicked!')
          }); alert(newEmail);
          document.querySelector('#show-mails').append(newEmail);
      }
    })
  }


         
        /*
        newButton = document.createElement('button', "lol");
        newButton.setAttribute("id", "emailBtn" + x);
        console.log(x);
        console.log("got here lol");
        
        emailBody = document.createElement('div');
        emailBody.setAttribute("class", "email"); 
        //emailBody.style.display = "none";
        //once DOM loaded, load email body but hide them
       
      ////////////////////////////////////////////////////////
     
            
        //newButton.setAttribute("")
        emailBody.innerHTML = emails[x]['body'];
        
        // newEmail.innerHTML = //if emails[x][read] == true bckgrnd color = white else grey
         `<p> <b>Sender: </b> ${emails[x]['sender']} </p>
          <p> <b> Subject: </b>   ${emails[x]['subject']}</p> 
          <p> <b> Time Sent: </b>${emails[x]['timestamp']} </p>
          `;
           
          //show emails[x]['body'] and emails[x]['read'] = true
           document.querySelector('#show-mails').append(newEmail,emailBody, newButton); 
           document.querySelector(`#emailBtn${x}`).addEventListener.onclick = function () {//show body of this email}
          if (emailBody.style.display === 'none'){
            emailBody.style.display = 'block';
          }
          else {emailBody.style.display = 'none';
          }
        }
          }
           element = document.createElement('div');
        element.setAttribute("id", "emailDiv" + x);
        element.innerHTML = `<p> <b>Sender: </b> ${emails[x]['sender']} </p>
        <p> <b> Subject: </b>   ${emails[x]['subject']}</p> 
        <p> <b> Time Sent: </b>${emails[x]['timestamp']} </p>
        `;
        element.addEventListener('click', function() {
          alert(emails[x]['id']);
          get_email(emails[x]['id']);
            console.log('This element has been clicked!')
        }); alert(element);
        document.querySelector('#show_mails').append(element);*/
          
       
    
     
    // document.querySelector('#emais-view').innerHTML = //for each email, in an unordered list, a list item <ul></ul>
     //list by sender, subject, body
     //if this email == read , then background = gray
     
     // ... do something else with emails ...
  


    if (mailbox == 'archive') {
 //stuff to do with the archive emails
 fetch('/emails/archive')
 .then(response => response.json())
 .then(emails => {
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

/* function show_emails () {
  document.querySelector('#show-mails').innerHTML = `<p> <b>Sender: </b> ${emails[0]['sender']} </p>
     <p> <b> Subject: </b>   ${emails[0]['subject']}</p>  <p> <b> Body: </b>${emails[0]['body']} </p>`;
} */
// function show_emails (email) {
 // document.querySelector('#show-mails').innerHTML = `<p> <b>Sender: </b> ${emails[x]['sender']} </p>
 //    <p> <b> Subject: </b>   ${emails[x]['subject']}</p>  <p> <b> Body: </b>${emails[x]['body']} </p>`;
//} 

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


function Show_Emails(x) {
  if (document.querySelector(`#emailBody${x}`).display.style === 'none') {
    document.querySelector(`#emailBody${x}`).display.style = 'block';
  }
  else {
   document.querySelector(`#emailBody${x}`).display.style = 'none';
  }
}
function get_email(x) {
fetch(`/emails/${x}`)
.then(response => response.json())
.then(email => {
    // Print email
    console.log(email.sender);
    displayEmail = document.createElement('div');
    displayEmail.innerHTML = `<p> Sent by: ${email.sender}</p> <p>subject: ${email.subject}</p> <p> ${email.body} `;
    document.querySelector("#current-email").append(displayEmail);
    if (document.querySelector("#current-email").style.display == 'none'){
    console.log(document.querySelector("#current-email").style.display);
    
      document.querySelector("#current-email").style.display = 'block';
      document.querySelector("#show-mails").style.display = 'none';
      console.log("current should show" + document.querySelector("#current-email").style.display);
    }
    else {
      document.querySelector("#current-email").style.display = 'none';
      document.querySelector("#show-mails").style.display = 'block';
      console.log(document.querySelector("#current-email").style.display);
    }
    

    // ... do something else with email ...
  });
}


