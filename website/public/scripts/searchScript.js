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

document.addEventListener('DOMContentLoaded', function() {
    getReccomendations(); // Call the function when the DOM is fully loaded
});

async function getReccomendations() {
    // const response = await fetch('/five');
    
    //   if (response.ok) {
    //      const data = await response.json();
    //      console.log(data);

    //   } 
    //   else {
    //     alert('Failed to generate the HTML file.');
    //   }
}

// Get the canvas element
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

// Create the chart
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: generateYears(1993, 2024),
        datasets: [
            {
                label: 'Quarter 1',  // First line
                data: generateDataForYears(),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Quarter 2',  // Second line
                data: generateDataForYears(),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Quarter 3',  // Third line
                data: generateDataForYears(),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            },
            {
                label: 'Quarter 4',  // Third line
                data: generateDataForYears(),
                backgroundColor: 'rgba(200, 100, 255, 0.2)',
                borderColor: 'rgba(200, 100, 255, 1)',
                borderWidth: 1
            },
            // You can add more datasets here for additional lines
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            },
            x: {
                beginAtZero: true
            }
        }
    }
});



const map = L.map('map', {
    dragging: false, 
    scrollWheelZoom: false, 
    doubleClickZoom: false, 
    boxZoom: false, 
    keyboard: false, 
    zoomControl: false 
}).setView([39.8283, -98.5795], 4);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);


const locations = [
    { name: "Los Angeles International Airport (LAX)", lat: 33.9416, lng: -118.4085 },
    { name: "John F. Kennedy International Airport (JFK)", lat: 40.6413, lng: -73.7781 }
];

locations.forEach(location => {
    L.marker([location.lat, location.lng])
        .addTo(map)
        .bindPopup(`<b>${location.name}</b><br>Lat: ${location.lat}, Lng: ${location.lng}`);
});

// Draw a line between Los Angeles and New York
const pathCoordinates = [
    [33.9416, -118.4085],
    [40.6413, -73.7781] 
];

L.polyline(pathCoordinates, { color: 'blue', weight: 3 }).addTo(map);


document.addEventListener('DOMContentLoaded', function() {
allOriginAirports(); // Call the function when the DOM is fully loaded
});

let distinctAirports = [];

let destinationAirports = [];

// Get the select element
const selectElement = document.getElementById("originAirport");

async function allOriginAirports() {
    const response = await fetch('/one');

    if (response.ok) {
        const data = await response.json();
        distinctAirports = data.distinctAirports;
        //console.log("Client:");
        //console.log(distinctAirports);

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

function checkWorking() {
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

        myChart.data.datasets[0].data = [];
        myChart.data.datasets[1].data = [];
        myChart.data.datasets[2].data = [];
        myChart.data.datasets[3].data = [];

        const data = await response.json();
        console.log(data);

        for (x in data.graphData) {
            if (data.graphData[x].quarter == '1') {
                myChart.data.datasets[0].data = data.graphData[x].yearsFormatted;
            }
            else if (data.graphData[x].quarter == '2') {
                myChart.data.datasets[1].data = data.graphData[x].yearsFormatted;
            }
            else if (data.graphData[x].quarter == '3') {
                myChart.data.datasets[2].data = data.graphData[x].yearsFormatted;
            }
            else if (data.graphData[x].quarter == '4') {
                myChart.data.datasets[3].data = data.graphData[x].yearsFormatted;
            }
        }
        myChart.update();
        
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
        console.log(data);
    } 
    else {
      alert('Failed to generate the HTML file.');
    }
}