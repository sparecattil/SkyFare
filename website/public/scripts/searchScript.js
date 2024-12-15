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
    return Array.from({ length: generateYears(1993, 2024).length }, () => Math.floor(Math.random() * 20));
}

// Create the chart
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: generateYears(1993, 2024),
        datasets: [{
            label: 'Votes',
            data: generateDataForYears(),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
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

// Get the select element
const selectElement = document.getElementById("originAirport");

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