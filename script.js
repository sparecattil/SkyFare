// Get the canvas element
const ctx = document.getElementById('myChart').getContext('2d');

// Create the chart
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'Votes',
            data: [12, 19, 3, 5, 2, 3],
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
            }
        }
    }
});

const bounds = [
    [24.396308, -125.0],
    [49.384358, -66.93457] 
];

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