function submitAccountInformation(){
  window.location.href = "/search.html";
}

document.addEventListener('DOMContentLoaded', function() {
  allOriginAirports(); // Call the function when the DOM is fully loaded
});

let distinctAirports = [];

// Get the select element
const selectElement = document.getElementById("homeAirport");

async function allOriginAirports() {
    const response = await fetch('/one');

    if (response.ok) {
        const data = await response.json();
        distinctAirports = data.distinctAirports;
        console.log("Client:");
        console.log(distinctAirports);

        // Loop through the airports array and create option elements
        distinctAirports.forEach(airport => {
          const option = document.createElement("option");
          option.value = airport; // Set the value attribute
          option.textContent = airport; // Set the visible text
          selectElement.appendChild(option); // Append the option to the select
        });
    } 
    else {
        alert('Response from server not received');
    }
}

selectElement.addEventListener("change", function() {
    if (!(selectElement.value == "Home Airport")) {
      const priceRange = document.getElementById("priceRange");
      const distance = document.getElementById("distance");
      const submitAccount = document.getElementById("submitAccount");
      priceRange.disabled = false;
      distance.disabled = false;
      submitAccount.disabled = false;
    }
    else {
      const priceRange = document.getElementById("priceRange");
      const distance = document.getElementById("distance");
      const submitAccount = document.getElementById("submitAccount");
      priceRange.disabled = true;
      distance.disabled = true;
      submitAccount.disabled = true;
    }

});
  