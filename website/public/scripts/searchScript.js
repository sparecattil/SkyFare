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
        // Repose if server errors out
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

selectElement.addEventListener("change", function() {
    //console.log("HERE");
    if (!(selectElement.value == "Origin Airport")) {
      const destinationAirport = document.getElementById("destinationAirport");
      destinationAirport.disabled = false;
      allDestinationAirports();
    }
    else {
      const destinationAirport = document.getElementById("destinationAirport");
      destinationAirport.disabled = true;
    }
});

const destinationElement = document.getElementById("destinationAirport");

destinationElement.addEventListener("change", function() {
    if (!(destinationElement.value == "Destination Airport")) {
        const submitFlights = document.getElementById("submitFlights");
        submitFlights.disabled = false;
    }
    else {
        const submitFlights = document.getElementById("submitFlights");
        submitFlights.disabled = true;
    }
});

function searchRoute() {
    getCoordinates();
    getSearchResults();
}

async function getSearchResults() {

    const response = await fetch('/four', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originAirport: selectElement.value, destinationAirport: destinationElement.value }),
      });
      if (response.ok) {
        const data = await response.json();
        chartData = data;
        updateChart(chartData);
      }
      else {
        alert('Failed to generate the HTML file.');
      }
}

async function allDestinationAirports() {
    destinationAirports = [];
    while (destinationElement.firstChild) {
        destinationElement.removeChild(destinationElement.firstChild);
    }
    let originAirport = selectElement.value;
    //console.log("Origin Airport");
    //console.log(originAirport);
    const response = await fetch('/three', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originAirport }),
    });
  
    if (response.ok) {
        const data = await response.json();
        destinationAirports = data.routesFromOrigin;
        //console.log("Client:");
        //console.log(destinationAirports);

        // Loop through the airports array and create option elements

        const option = document.createElement("option");
        option.value = "Desitnation Airport"; // Set the value attribute
        option.textContent = "Desitnation Airport"; // Set the visible text
        destinationElement.appendChild(option); // Append the option to the select

        destinationAirports.forEach(airport => {
        const option = document.createElement("option");
        option.value = airport; // Set the value attribute
        option.textContent = airport; // Set the visible text
        destinationElement.appendChild(option); // Append the option to the select
        });
    } 
    else {
      alert('Failed to generate the HTML file.');
    }
}

async function getCoordinates() {
    const originAirport = document.getElementById("originAirport").value;
    const destinationAirport = document.getElementById("destinationAirport").value;
    const response = await fetch('/seven', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originAirport, destinationAirport }),
    });

    if (response.ok) {
        const data = await response.json();
        //console.log(data);

        clearMap();
        let locations = [];
        let pathCoordinates = [];

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
        
        // Add markers and store them in the array
        locations.forEach(location => {
            const marker = L.marker([location.lat, location.lng])
                .addTo(map)
                .bindPopup(`<b>${location.name}</b><br>Lat: ${location.lat}, Lng: ${location.lng}`);
            markers.push(marker); // Store the marker reference
        });
        
        polyline = L.polyline(pathCoordinates, { color: 'blue', weight: 3 }).addTo(map);

    } 
    else {
      alert('Failed to generate the HTML file.');
    }
}

function updateChart(data) {
    const quarterChart = document.getElementById("quarterChart").value;
    myChart.data.datasets = [];

    //console.log(data);
    
    for (x in data.graphData){
        if (data.graphData[x].airline in airlineCompany){
            company = airlineCompany[data.graphData[x].airline];
        }
        else {
            company = "IAATA: " + data.graphData[x].airline;
        }
        //console.log(data.graphData[x].years);

        const yearToPrice = data.graphData[x].years.reduce((acc, item) => {
            acc[item.year] = item.avgPrice;
            return acc;
        }, {});

        const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
        const randomBorderColor = randomColor.replace("0.2", "1");
        
        let checkQuarter = quarterChart.slice(-1);
        //console.log(checkQuarter);

        if (data.graphData[x].airline != ''){
            if (checkQuarter == data.graphData[x].quarter) {
                //console.log("HERE");
                const newDataset = {
                    label: company, // Name for the dataset (e.g., an airline name)
                    data: yearToPrice, // Data points for the X-axis labels
                    backgroundColor: randomColor, // Fill color (for bar or radar charts)
                    borderColor: randomBorderColor, // Line color (for line charts)
                    borderWidth: 1, // Line thickness
                };
                myChart.data.datasets.push(newDataset);
            }
        }
    }
        
    // Add the new dataset
    
    myChart.update();
}

const quarterChart = document.getElementById("quarterChart");

quarterChart.addEventListener("change", function() {
    updateChart(chartData);
});

async function checkUserStatus() {
    const response = await fetch('/userActive');
    if (response.ok) {
        const data = await response.json();
        if (data.exists == 0) {
        clearInterval(userActive);
        window.location.href = "/userInformation.html";
        }
    }
    else {
        alert('Failed to generate the HTML file.');
    }
}

let userActive = setInterval(checkUserStatus, 1000);



