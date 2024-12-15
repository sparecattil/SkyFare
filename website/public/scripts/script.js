function nextPage() {
    checkUsername();
}

const username = document.getElementById("username");
const password = document.getElementById("password");
const login = document.getElementById("login");

password.addEventListener("change", function() {
    if (password.value != ''){
        login.disabled = false;
    }
    else {
        login.disabled = true;
    }
});

async function checkUsername() {

    const response = await fetch('/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.value, password: password.value}),
      });
    
      if (response.ok) {
        const data = await response.json();
        console.log(data.signInStatus);
        if (data.signInStatus == true){
            password.classList.remove("error");
            username.value = '';
            password.value = '';
            window.location.href = "/userInformation.html"

        }
        else if (data.signInStatus == false) {
            password.value = '';
            password.classList.add("error");
            login.disabled = true;
        } 
        
      } 
      else {
        alert('Failed to generate the HTML file.');
      }
}

