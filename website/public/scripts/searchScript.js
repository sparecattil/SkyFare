///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////Get All Reccomendation Elemnets////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
const fromOne = document.getElementById("fromOne");
const fromTwo = document.getElementById("fromTwo");
const fromThree = document.getElementById("fromThree");
const fromFour = document.getElementById("fromFour");

const toOne = document.getElementById("toOne");
const toTwo = document.getElementById("toTwo");
const toThree = document.getElementById("toThree");
const toFour = document.getElementById("toFour");

const airlineOne = document.getElementById("airlineOne");
const airlineTwo = document.getElementById("airlineTwo");
const airlineThree = document.getElementById("airlineThree");
const airlineFour = document.getElementById("airlineFour");

const milesOne = document.getElementById("milesOne");
const milesTwo = document.getElementById("milesTwo");
const milesThree = document.getElementById("milesThree");
const milesFour = document.getElementById("milesFour");

const priceOne = document.getElementById("priceOne");
const priceTwo = document.getElementById("priceTwo");
const priceThree = document.getElementById("priceThree");
const priceFour = document.getElementById("priceFour");
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Variable To Store Data For Full Text Search Data
let chartData;

// Dictionary that stores IAATA Airline code to Airline name
let airlineCompany = {  "AA": "American Airlines",
                        "AS": "Alaska Airlines",
                        "DL": "Delta Air Lines",
                        "EV": "Envoy Air",
                        "F9": "Frontier Airlines",
                        "HA": "Hawaiian Airlines",
                        "MQ": "Envoy Air",
                        "NW": "Northwest Airlines",
                        "NK": "Spirit Airlines",
                        "OO": "SkyWest Airlines",
                        "US": "US Airways",
                        "UA": "United Airlines",
                        "WN": "Southwest Airlines",
                        "B6": "JetBlue Airways",
                        "G4": "Allegiant Air",
                        "P7": "Piedmont Airlines",
                        "YV": "Mesa Air Group",
                        "9X": "Compass Airlines",
                        "ZK": "Trans States Airlines",
                        "QX": "Horizon Air",
                        "I5": "Sun Country Airlines",
                        "M7": "Mesa Air Group   ",
                        "P8": "Piedmont Airlines",
                        "CO": "Continental Airlines",
                        "FL": "AirTran Airways",
                        "HP": "Amapola Flyg AB",
                        "J7": "Afrijet Business Service",
                        "MX": "Breeze Airways",
                        "RU": "AirBridgeCargo Airlines",
                        "U2": "easyJet",
                        "PN": "China West Air", 
                        "ZW": "Air Wisconsin",
                        "XJ": "Thai AirAsia X",
                        "SY": "Sun Country",
                        "TW": "T'way Air",
                        "U5": "SkyUp MT",
                        "DH": "Norwegian Air",
                        "HQ": "Thomas Cook Airlines",
                        "JI": "Armenian Airlines",
                        "KS": "Penair",
                        "KW": "Air company AeroStan",
                        "TZ": "Air Tanzania",
                        "UK": "VISTARA",
                        "9K": "Cape Air",
                    };


// Event listner on load of the page will call method to get reccomendations
// and method to generate all origin Airports
document.addEventListener('DOMContentLoaded', function() {
    getReccomendations();
    allOriginAirports();

});

///////////////////////////////////////////////
// Function Name: getReccomendations 
// Description: The following fucntion calls 
//              the server to query the users
//              reccomendations based on 
//              account information. If the 
//              server responds with data, 
//              formats data into 
//              Reccomendation boxes for each
//              quarter.
///////////////////////////////////////////////
async function getReccomendations() {

    // Variable To Store Airline Company Name 
    let company;

    // Request to server to run query
    const response = await fetch('/five');
    
    // If server responds without error
    if (response.ok) {
        const data = await response.json();
        //console.log(data);
        

        ///////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////Set all Boxes To Default No Options/////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////
        fromOne.innerHTML = "  ";
        toOne.innerHTML = "  ";
        airlineOne.innerHTML = "NO OPTIONS";
        airlineOne.style.textAlign = "center";
        airlineOne.style.fontWeight = "bold";
        milesOne.innerHTML = "  ";
        priceOne.innerHTML = "<br>  <br>  <br> <br> ";

        fromTwo.innerHTML = "  ";
        toTwo.innerHTML = "  ";
        airlineTwo.innerHTML = "NO OPTIONS";
        airlineTwo.style.textAlign = "center";
        airlineTwo.style.fontWeight = "bold";
        milesTwo.innerHTML = "  ";
        priceTwo.innerHTML = "<br>  <br>  <br> <br> ";

        fromThree.innerHTML = "  ";
        toThree.innerHTML = "  ";
        airlineThree.innerHTML = "NO OPTIONS";
        airlineThree.style.textAlign = "center";
        airlineThree.style.fontWeight = "bold";
        milesThree.innerHTML = "  ";
        priceThree.innerHTML = "<br>  <br>  <br> <br> ";


        fromFour.innerHTML = "  ";
        toFour.innerHTML = "  ";
        airlineFour.innerHTML = "NO OPTIONS";
        airlineFour.style.textAlign = "center";
        airlineFour.style.fontWeight = "bold";
        milesFour.innerHTML = "  ";
        priceFour.innerHTML = "<br>  <br>  <br> <br> ";
        ///////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////
    
        // Parse through all data
        for (x in data.recommendations) {

            // If IAATA in dictionary then set the name, else keep IAATA Code
            if (data.recommendations[x].airline in airlineCompany){
                company = airlineCompany[data.recommendations[x].airline];
            }
            else {
                company = "IAATA: " + data.recommendations[x].airline; 
            }

            // Check if the data array is matching the specified quarter box
            // If match occurs then format necessary data
            // else keep No Options Default
            if (data.recommendations[x].quarter == '1') {
                fromOne.innerHTML = "<b>From:</b>" + data.recommendations[x].origin;
                toOne.innerHTML = "<b>To:</b>" + data.recommendations[x].destination;
                airlineOne.innerHTML = "<b>Airline:</b>" + company;
                airlineOne.style.textAlign = "left";
                airlineOne.style.fontWeight = "normal";
                milesOne.innerHTML = "<b>Miles:</b>" + data.recommendations[x].miles;
                priceOne.innerHTML = "<b>Price:</b>" + data.recommendations[x].price;
            }
            else if (data.recommendations[x].quarter == '2') {
                fromTwo.innerHTML = "<b>From:</b>" + data.recommendations[x].origin;
                toTwo.innerHTML = "<b>To:</b>" + data.recommendations[x].destination;
                airlineTwo.innerHTML = "<b>Airline:</b>" + company;
                airlineTwo.style.textAlign = "left";
                airlineTwo.style.fontWeight = "normal";
                milesTwo.innerHTML = "<b>Miles:</b>" + data.recommendations[x].miles;
                priceTwo.innerHTML = "<b>Price:</b>" + data.recommendations[x].price;
            }
            else if (data.recommendations[x].quarter == '3') {
                fromThree.innerHTML = "<b>From: </b>" + data.recommendations[x].origin;
                toThree.innerHTML = "<b>To:</b>" + data.recommendations[x].destination;
                airlineThree.innerHTML = "<b>Airline:</b>" + company;
                airlineThree.style.textAlign = "left";
                airlineThree.style.fontWeight = "normal";
                milesThree.innerHTML = "<b>Miles:</b>" + data.recommendations[x].miles;
                priceThree.innerHTML = "<b>Price:</b>" + data.recommendations[x].price;
            }
            else if (data.recommendations[x].quarter == '4') {
                fromFour.innerHTML = "<b>From:</b>" + data.recommendations[x].origin;
                toFour.innerHTML = "<b>To:</b>" + data.recommendations[x].destination;
                airlineFour.innerHTML = "<b>Airline:</b>" + company;
                airlineFour.style.textAlign = "left";
                airlineFour.style.fontWeight = "normal";
                milesFour.innerHTML = "<b>Miles:</b>" + data.recommendations[x].miles;
                priceFour.innerHTML = "<b>Price:</b>" + data.recommendations[x].price;
            }
        }

    } 
    else {
        // Response if server errors out
        alert('Failed to generate the HTML file.');
    }
}

// Canvas Element for 2D Chart
const ctx = document.getElementById('myChart').getContext('2d');


function generateYears(startYear, endYear) {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
        years.push(year.toString());
    }
    return years;
}

// Function to generate random data for each year (replace with actual data)
function generateDataForYears() {
    return Array.from({ length: generateYears(1993, 2024).length }, () => Math.floor(Math.random() * 100));
}

// Chart characteristics
const myChart = new Chart(ctx, {
    type: 'line', // Type of Line
    data: {
        labels: generateYears(1993, 2024), // X Axis Values
        datasets: [ // No Default Data
            
        ]
    },
    options: {
        scales: {
            // Y Axis Title and Begin at Zero
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Price ($)', 
                    font: {
                        size: 14 
                    }
                }
            },
            // X Axis Title and Begin at Zero
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Years', 
                    font: {
                        size: 14 
                    }
                }
            }
        }
    }
});

// Variable for Map Marker Coordinates
let markers = [];

// Variable for Map Line Coordinates
let polyline;

///////////////////////////////////////////////
// Function Name: clearMap 
// Description: The following fucntion calls 
//              removes the map layers for each
//              marker in the markers array.
//              Then if a line exists it 
//              removes the polyline.
///////////////////////////////////////////////
function clearMap() {

    // Remove all markers
    markers.forEach(marker => map.removeLayer(marker));

    // Remove Polyline
    if (polyline) {
        map.removeLayer(polyline);
    }

    // Set Varibles make to Default
    markers = [];
    polyline = null;
}

// Create Map Element with user controls set to false.
// The Map will only show the full coordinates of the US MAP
const map = L.map('map', {
    dragging: false, 
    scrollWheelZoom: false, 
    doubleClickZoom: false, 
    boxZoom: false, 
    keyboard: false, 
    zoomControl: false,
    zoomSnap: 0.01, // Allows fractional zoom levels
    zoomDelta: 0.01 // Adjusts the zoom step
}).setView([39.8283, -96.5795], 4.5);

// Renders Map Using Open Street Map 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Array to hold all origin airports
let distinctAirports = [];

// Array to hold all destination airports based on origin airport selected
let destinationAirports = [];

// Get Origin Airport Select Input Element
const selectElement = document.getElementById("originAirport");

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

// Event listener that checks if origin airport value is changed.
// If changed to "Origin Airport" then disable destination airport input field.
// else populate destination airport input field elements
selectElement.addEventListener("change", function() {
    //console.log("HERE");

    // If value selected in origin airport input field then enable destination airports and load elements
    if (!(selectElement.value == "Origin Airport")) {
      const destinationAirport = document.getElementById("destinationAirport");
      destinationAirport.disabled = false;
      allDestinationAirports();
    }
    // If value is not selected in origin airport input field then rest destination airport input field
    else {
      // Get destination input field
      const destinationAirport = document.getElementById("destinationAirport");

      // Remove all current elements
      while (destinationElement.firstChild) {
        destinationElement.removeChild(destinationElement.firstChild);
      }

      // Creat default element for destination airport
      const option = document.createElement("option");
      option.value = "Destination Airport"; // Set the value attribute
      option.textContent = "Destination Airport"; // Set the visible text
      destinationElement.appendChild(option); // Append the option to the select
      destinationAirport.disabled = true;
    }
});

// Get Destination input field element
const destinationElement = document.getElementById("destinationAirport");

// Even listener that checks if destination input field has changed.
// If not default value then enable submit button, else disable.
destinationElement.addEventListener("change", function() {
    // If not default value
    if (!(destinationElement.value == "Destination Airport")) {
        const submitFlights = document.getElementById("submitFlights");
        // Enable Button
        submitFlights.disabled = false;
    }
    else {
        const submitFlights = document.getElementById("submitFlights");
        // Disable Button
        submitFlights.disabled = true;
    }
});

///////////////////////////////////////////////
// Function Name: searchRoute 
// Description: The following button is called 
//              when the user hits the submit 
//              button. Its purpose is to 
//              populate the coordinates for 
//              the map and update the chart 
//              data.
///////////////////////////////////////////////
function searchRoute() {
    getCoordinates();
    getSearchResults();
}

///////////////////////////////////////////////
// Function Name: getSearchResults 
// Description: The following function asks the 
//              server to run the full-text 
//              search query on the "Origin 
//              Destination Airports". The 
//              server will return data and 
//              then a method to update the 
//              chart is called.
///////////////////////////////////////////////
async function getSearchResults() {

    // Aks the server to query the price history given the origin and destination airport
    const response = await fetch('/four', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originAirport: selectElement.value, destinationAirport: destinationElement.value }),
    });
    // If the server responds with no error
    if (response.ok) {
        // Get the data received from the server
        const data = await response.json();
        chartData = data;
        // Call update chart method
        updateChart(chartData);
    }
    else {
        alert('Failed to generate the HTML file.');
    }
}

///////////////////////////////////////////////
// Function Name: allDestinationAirports 
// Description: The following function will 
//              tell the server to query  the 
//              destination airports given the 
//              origin airport.
///////////////////////////////////////////////
async function allDestinationAirports() {
    // Set destination airports to empty
    destinationAirports = [];
    // Remove all current child elements
    while (destinationElement.firstChild) {
        destinationElement.removeChild(destinationElement.firstChild);
    }

    // Get the value for teh current selected origin airport
    let originAirport = selectElement.value;
    //console.log("Origin Airport");
    //console.log(originAirport);

    // Ask the server to query
    const response = await fetch('/three', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originAirport }),
    });
    
    // If the server responds with no errors
    if (response.ok) {
        // Get the data received from the server
        const data = await response.json();
        // Get the array
        destinationAirports = data.routesFromOrigin;
        //console.log("Client:");
        //console.log(destinationAirports);

        // Creat defualt child element
        const option = document.createElement("option");
        option.value = "Destination Airport"; // Set the value attribute
        option.textContent = "Destination Airport"; // Set the visible text
        destinationElement.appendChild(option); // Append the option to the select

        // Parse through array and create a new selectable element for each input.
        destinationAirports.forEach(airport => {
        const option = document.createElement("option");
        option.value = airport; // Set the value attribute
        option.textContent = airport; // Set the visible text
        destinationElement.appendChild(option); // Append the option to the select
        });
    } 
    else {
        // Response if server errors out
      alert('Failed to generate the HTML file.');
    }
}

///////////////////////////////////////////////
// Function Name: getCoordinates 
// Description: The following function akses 
//              the server to query the 
//              coordinates of the origin and 
//              destination airport. If the 
//              server responds with data 
//              format the data into markers 
//              displayed on the map and 
//              create a line on the map.
///////////////////////////////////////////////
async function getCoordinates() {

    // Get the origin airport input element
    const originAirport = document.getElementById("originAirport").value;

    // Get the destination airport input element
    const destinationAirport = document.getElementById("destinationAirport").value;

    // Ask the server to run the query to get the coordinates of the following origin and destination airports.
    const response = await fetch('/seven', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originAirport, destinationAirport }),
    });

    // If the server responds with no error
    if (response.ok) {
        // Grab the data recieved from the server.
        const data = await response.json();
        //console.log(data);

        // Clear the Map 
        clearMap();
        
        // Set the location array to empty
        let locations = [];
        // Set the pathCoordinates array to empty
        let pathCoordinates = [];

        // If the origin airport or destination is "MIA" chnages the coordinate values to correct coordinates.
        if (originAirport == "MIA") {
            locations = [
                { name: originAirport, lat: 25.79, lng: -80.28 },
                { name: destinationAirport, lat: data.destLat, lng: data.destLon }
            ];
            pathCoordinates = [
                [25.79, -80.28],
                [data.destLat, data.destLon]
            ];
        }
        else if (destinationAirport == "MIA"){
            locations = [
                { name: originAirport, lat: data.originLat, lng: data.originLon },
                { name: destinationAirport, lat: 25.79, lng: -80.28 }
            ];
            pathCoordinates = [
                [data.originLat, data.originLon],
                [25.79, -80.28]
            ];
        }
        // Else continue uing the values returned by the server
        else {
            locations = [
                { name: originAirport, lat: data.originLat, lng: data.originLon },
                { name: destinationAirport, lat: data.destLat, lng: data.destLon }
            ];
            // Draw a polyline (path) between origin and destination
            pathCoordinates = [
                [data.originLat, data.originLon],
                [data.destLat, data.destLon]
            ];
        }
        
        // For all locations in the location array create a marker
        locations.forEach(location => {
            const marker = L.marker([location.lat, location.lng])
                .addTo(map)
                .bindPopup(`<b>${location.name}</b><br>Lat: ${location.lat}, Lng: ${location.lng}`);
            markers.push(marker); // Store the marker reference
        });
        
        // Create a line from origin to destination airport given the pathCoordinates array.
        polyline = L.polyline(pathCoordinates, { color: 'blue', weight: 3 }).addTo(map);

    } 
    else {
        // Response if server errors out
      alert('Failed to generate the HTML file.');
    }
}

///////////////////////////////////////////////
// Function Name: updateChart 
// Input: Graph Data Array
// Description: The following function parses 
//              through the data given and 
//              populates a new dataset for 
//              each airline depending on the
//              selected quarter.
///////////////////////////////////////////////
function updateChart(data) {
    // Get quarter select input element value
    const quarterChart = document.getElementById("quarterChart").value;

    // Set chart datasets to empty
    myChart.data.datasets = [];

    //console.log(data);
    
    // Parse through the data
    for (x in data.graphData){
        // If the airline is in the dictionary set value else keep IAATA code
        if (data.graphData[x].airline in airlineCompany){
            company = airlineCompany[data.graphData[x].airline];
        }
        else {
            company = "IAATA: " + data.graphData[x].airline;
        }
        //console.log(data.graphData[x].years);

        // Convert Dictionary of attributes to new from (year: price)
        const yearToPrice = data.graphData[x].years.reduce((acc, item) => {
            acc[item.year] = item.avgPrice;
            return acc;
        }, {});

        // randomColor generator
        const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
        
        // Boder Change opacity
        const randomBorderColor = randomColor.replace("0.2", "1");
        
        // Get the quarter from the selectable input field
        let checkQuarter = quarterChart.slice(-1);
        //console.log(checkQuarter);

        // If the airline is empty then skip that data.
        if (data.graphData[x].airline != ''){
            // if the quarter matches what is being selected on the GUI then populate that data as a new dataset
            if (checkQuarter == data.graphData[x].quarter) {
                //console.log("HERE");
                const newDataset = {
                    label: company, 
                    data: yearToPrice,
                    backgroundColor: randomColor, 
                    borderColor: randomBorderColor, 
                    borderWidth: 1, 
                };
                // Add the dataset to the chart
                myChart.data.datasets.push(newDataset);
            }
        }
    }
    // Update the chart
    myChart.update();
}

// Get quarter select input element
const quarterChart = document.getElementById("quarterChart");

// Event listener to update chart upon quarter change.
quarterChart.addEventListener("change", function() {
    updateChart(chartData);
});

///////////////////////////////////////////////
// Function Name: checkUserStatus 
// Description: The following function asks 
//              the server to check the TTL 
//              value of the user. If the user 
//              is not active then send the 
//              user back to the 
//              userInformation.html page.
///////////////////////////////////////////////
async function checkUserStatus() {
    // Ask server to check TTL status for user
    const response = await fetch('/userActive');

    // If the server responds with no error
    if (response.ok) {
        const data = await response.json();
        // If user not active
        if (data.exists == 0) {
            // Clear Interval
            clearInterval(userActive);
            // Move to Page
            window.location.href = "/userInformation.html";
        }
    }
    else {
        // Response if server errors out
        alert('Failed to generate the HTML file.');
    }
}

// Interval variable for continuous checks in user details TTL in Redis
let userActive = setInterval(checkUserStatus, 1000);