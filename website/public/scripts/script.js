///////////////////////////////////////////////
// Function Name: nextPage 
// Description: Calls method to check username
///////////////////////////////////////////////
function nextPage() {
    checkUsername();
}

// Get Username Input Element
const username = document.getElementById("username");

// Get Password Input Element
const password = document.getElementById("password");

// Get Login Button Element
const login = document.getElementById("login");

// Event listener on password input
// if password input box is filled 
// enable login button
password.addEventListener("change", function() {
    if (password.value != ''){
      // Enable login button
        login.disabled = false;
    }
    else {
        // Disable login button
        login.disabled = true;
    }
});

///////////////////////////////////////////////
// Function Name: checkUsername 
// Description: This asynchronous function
//              calls the server and sends in 
//              the user's inputs from both the 
//              username and password field. If
//              the server responds with a 
//              positive marker the user is 
//              logged in or signed in and 
//              moved to the next page, else 
//              the user is notified that the 
//              password inputted in incorrect.
///////////////////////////////////////////////
async function checkUsername() {
  // Aks Server
  const response = await fetch('/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send server username and password
      body: JSON.stringify({ username: username.value, password: password.value}),
    });
    
    // If server responds without error
    if (response.ok) {
      // Get data recieved from server
      const data = await response.json();

      //console.log(data.signInStatus);

      // If status is true
      if (data.signInStatus == true){
        // Remove Error On Password Input
        password.classList.remove("error");
        username.value = '';
        password.value = '';
        
        // Determine page navigation by checking user status
        checkUserStatus();
      }
      // if status is false
      else if (data.signInStatus == false) {
        password.value = '';
        // Add Error On Password Input
        password.classList.add("error");
        // Disable Login Button
        login.disabled = true;
      } 
      
    } 
    else {
      // Server Error Alert
      alert('Failed to generate the HTML file.');
    }
}

///////////////////////////////////////////////
// Function Name: checkUserStatus 
// Description: The following function asks 
//              the server to check the TTL 
//              value of the user. If active 
//              then send to search page, else 
//              send the user to the 
//              userInformation page to fill 
//              out the necessary details. 
///////////////////////////////////////////////
async function checkUserStatus() {
  const response = await fetch('/userActive');
  if (response.ok) {
    const data = await response.json();
    // If user not active
    if (data.exists == 0) {
      window.location.href = "/userInformation.html";
    }
    // If user is active
    else {
      window.location.href = "/search.html"
    }
  }
  else {
    alert('Failed to generate the HTML file.');
  }
}