function submitAccountInformation(){
  
    window.location.href = "/search.html";
  }
  
  const airports = ["JFK", "LAX", "ORD", "SFO"];
  
      // Get the select element
  const selectElement = document.getElementById("homeAirport");
  
      // Loop through the airports array and create option elements
  airports.forEach(airport => {
    const option = document.createElement("option");
    option.value = airport; // Set the value attribute
    option.textContent = airport; // Set the visible text
    selectElement.appendChild(option); // Append the option to the select
  });
  
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
  