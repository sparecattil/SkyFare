let distinctAirports = [];

let fares = [];

let miles = [];

const selectElement = document.getElementById("homeAirport");
const priceRange = document.getElementById("priceRange");
const distance = document.getElementById("distance");

function submitAccountInformation(){
  let sendMiles = distance.value.slice(-6);

  const response = fetch('/accountDetails', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ originAirport: selectElement.value, price: priceRange.value, miles: sendMiles }),
  });
  //console.log( selectElement.value, priceRange.value, sendMiles );
  window.location.href = "/search.html";
}

document.addEventListener('DOMContentLoaded', function() {
  allOriginAirports(); // Call the function when the DOM is fully loaded
});

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
      const submitDetails = document.getElementById("submitDetails");
      priceRange.disabled = false;
      distance.disabled = false;
      submitDetails.disabled = false;
      priceRangeAndDistanceOptions(selectElement.value);
    }
    else {
      const submitDetails = document.getElementById("submitDetails");
      priceRange.disabled = true;
      distance.disabled = true;
      submitDetails.disabled = true;
    }
});

async function priceRangeAndDistanceOptions(originAirport) {
  fares = [];
  miles = [];
  while (priceRange.firstChild) {
    priceRange.removeChild(priceRange.firstChild);
  }

  while (distance.firstChild) {
    distance.removeChild(distance.firstChild);
  }

  const response = await fetch('/two', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originAirport }),
  });

  if (response.ok) {
      const data = await response.json();
      const { maxFare, minFare, maxMiles, minMiles } = data; // Adjust according to data received
      console.log("Client:");
      console.log({ maxFare, minFare, maxMiles, minMiles });

      for (let fare = minFare; fare <= maxFare; fare += 100) {
        // Round the fare to the nearest 10 dollars (though increments of 100 should already be rounded)
        const roundedFare = Math.round(fare / 10) * 10;
        
        // Check if the rounded fare is already in the fares array
        if (!fares.includes(roundedFare)) {
          fares.push(roundedFare);
        }
      }
      
      const optionElement = document.createElement('option');
      optionElement.value = "Price Range";
      optionElement.textContent = "Price Range";
      priceRange.appendChild(optionElement);

      fares.forEach(fare => {
        const optionElement = document.createElement('option');
        optionElement.value = fare;
        optionElement.textContent = `$${fare}`;
        priceRange.appendChild(optionElement);
      });
      
      // Loop through and create options for every 100 miles, rounded to the nearest 10
      for (let mile = parseInt(minMiles); mile <= parseInt(maxMiles); mile += 100) {
        const roundedMile = Math.round(mile / 10) * 10;  // Round to nearest 10
        miles.push(roundedMile);
      }

      if (miles == []) {
        miles.push(parseInt(Math.round(parseInt(minMile) / 10) * 10));
        miles.push(parseInt(Math.round(parseInt(maxMile) / 10) * 10));
      }
      
      const elementTwo = document.createElement('option');
      elementTwo.value = "Distance";
      elementTwo.textContent = "Distance";
      distance.appendChild(elementTwo);

      console.log(miles);

      // Add new options to the dropdown
      miles.forEach(milesValue => {
        const optionElement = document.createElement('option');
        optionElement.value = milesValue;
        optionElement.textContent = `${milesValue} miles`;  // Display miles with 'miles' text
        distance.appendChild(optionElement);  // Append the option to the select element
      });
  } 
  else {
      alert('Response from server not received');
  }
}

distance.addEventListener("change", function() {
  if (distance.value != 'Distance' && priceRange.value != 'Price Range') {
    const submitDetails = document.getElementById("submitDetails");
    submitDetails.disabled = false;

  }
  else {
    submitDetails.disabled = true;
  }
});

  