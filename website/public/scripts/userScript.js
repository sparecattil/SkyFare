// Array for distinctAirport Query
let distinctAirports = [];

// Array for Fares Query
let fares = [];

// Array for Distance Query
let miles = [];

// Get origin airport select element
const selectElement = document.getElementById("homeAirport");

// Get priceRange select element
const priceRange = document.getElementById("priceRange");

// Get distance select element
const distance = document.getElementById("distance");

///////////////////////////////////////////////
// Function Name: submitAccountInformation 
// Description: The following function send to 
//              the server all the user's 
//              selected input fields for the 
//              constraint search query. Once 
//              done it will navigate the user 
//              to the main page.
///////////////////////////////////////////////
function submitAccountInformation(){
  // Slice off "miles" from the distance value
  let sendMiles = distance.value.slice(-6);

  // Send server JSON of originAirport, price, miles
  const response = fetch('/accountDetails', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ originAirport: selectElement.value, price: priceRange.value, miles: sendMiles }),
  });
  //console.log( selectElement.value, priceRange.value, sendMiles );

  // Navigate to the next page
  window.location.href = "/search.html";
}

// Event listner that listens upon load of the page. 
// Calls method to format all origin airports into teh correct select field.
document.addEventListener('DOMContentLoaded', function() {
  allOriginAirports();
});

///////////////////////////////////////////////
// Function Name: allOriginAirports 
// Description: The following function will 
//              ask the server to query all the
//              origin airports available. Then
//              given the server response will 
//              parse through the data and add
//              that as a potential value for
//              the user to select.
///////////////////////////////////////////////
async function allOriginAirports() {
  // Ask the server to query for all origin airports
  const response = await fetch('/one');

  // If server responds without error
  if (response.ok) {
    // Get data received from server
    const data = await response.json();
    distinctAirports = data.distinctAirports;
    //console.log("Client:");
    //console.log(distinctAirports);

    // For each element in array add it as a attribute to the select element of Home Airport
    distinctAirports.forEach(airport => {
      const option = document.createElement("option");
      option.value = airport; 
      option.textContent = airport; 
      selectElement.appendChild(option);
    });
  } 
  else {
    // Server Error Alert
    alert('Response from server not received');
  }
}

// Event Listener that checks if Home Airport has been selected by the user
selectElement.addEventListener("change", function() {

  // If the value is not "Home Airport"
  if (!(selectElement.value == "Home Airport")) {
    const submitDetails = document.getElementById("submitDetails");
    // Enable all other select elements as well as submit button
    priceRange.disabled = false;
    distance.disabled = false;
    submitDetails.disabled = false;
    priceRangeAndDistanceOptions(selectElement.value);
  }
  // If the value is "Home Airport"
  else {
    const submitDetails = document.getElementById("submitDetails");
    // Disable all other select elements as well as submit button
    priceRange.disabled = true;
    distance.disabled = true;
    submitDetails.disabled = true;
  }
});

///////////////////////////////////////////////
// Function Name: priceRangeAndDistanceOptions 
// Input: Origin Airport
// Description: The following function will 
//              call the server to query the 
//              min and max for both price and 
//              distance given the origin 
//              airport. Then will take the 
//              data from the server and 
//              populate all the selectable 
//              values for price range and 
//              distance.
///////////////////////////////////////////////
async function priceRangeAndDistanceOptions(originAirport) {
  // Empty Fares Array
  fares = []; 
  // Emtyp miles Array
  miles = [];

  // Remove all selectable elements from priceRange element
  while (priceRange.firstChild) {
    priceRange.removeChild(priceRange.firstChild);
  }
  // Remove all selectable elements from distance element
  while (distance.firstChild) {
    distance.removeChild(distance.firstChild);
  }

  // Tell server to query for all min and max values given origin airport
  const response = await fetch('/two', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      // Send origin airport to server
      body: JSON.stringify({ originAirport }),
  });

  // If server responds without error
  if (response.ok) {

      // Get Data
      const data = await response.json();

      //Format Data 
      const { maxFare, minFare, maxMiles, minMiles } = data; // Adjust according to data received
      //console.log("Client:");
      //console.log({ maxFare, minFare, maxMiles, minMiles });

      // For fare create $100 increments starting from Min to Max Fare
      for (let fare = minFare; fare <= maxFare; fare += 100) {
        
        // Round to nearest 10th digit
        const roundedFare = Math.round(fare / 10) * 10;
        
        // Push roundedFare to fares Array
        if (!fares.includes(roundedFare)) {
          fares.push(roundedFare);
        }
      }
      
      // Create First select option for price range element
      const optionElement = document.createElement('option');
      optionElement.value = "Budget";
      optionElement.textContent = "Budget";
      priceRange.appendChild(optionElement);

      // Parse through fare array and create selectable elements for the user
      fares.forEach(fare => {
        const optionElement = document.createElement('option');
        optionElement.value = fare;
        optionElement.textContent = `$${fare}`;
        priceRange.appendChild(optionElement);
      });
      
      // For miles create 100 mile increments starting from Min to Max miles
      for (let mile = parseInt(minMiles); mile <= parseInt(maxMiles); mile += 100) {

        // Round to nearest 10th digit
        const roundedMile = Math.round(mile / 10) * 10;

        // Push roundedMile to miles array
        miles.push(roundedMile);
      }

      // If the miles array is empty then append the min and max values rounded to the nearest 10th digit
      if (miles == []) {
        miles.push(parseInt(Math.round(parseInt(minMile) / 10) * 10));
        miles.push(parseInt(Math.round(parseInt(maxMile) / 10) * 10));
      }
      
      // Creat the first option for the distance element
      const elementTwo = document.createElement('option');
      elementTwo.value = "Preferred Distance";
      elementTwo.textContent = "Preferred Distance";
      distance.appendChild(elementTwo);

      //console.log(miles);

      // For each value in miles create a selectable element for the user to select
      miles.forEach(milesValue => {
        const optionElement = document.createElement('option');
        optionElement.value = milesValue;
        optionElement.textContent = `${milesValue} miles`;
        distance.appendChild(optionElement);
      });
  } 
  else {
    // Server Error Alert
    alert('Response from server not received');
  }
}

// Event Listener that checks when the user has seleceted a distance.
distance.addEventListener("change", function() {
  // If distance and priceRange element are filled 
  if (distance.value != 'Preferred Distance' && priceRange.value != 'Budget') {
    const submitDetails = document.getElementById("submitDetails");
    // Enable submit button
    submitDetails.disabled = false;

  }
  else {
    // Disable submit button
    submitDetails.disabled = true;
  }
});

  