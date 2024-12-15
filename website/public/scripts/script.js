function testNextPage() {
    window.location.href = "/userInformation.html"
}

function priceRangeAndDistanceOptionsCall() {
    var originAirport = "XXX"
    priceRangeAndDistanceOptions(originAirport)
}

async function priceRangeAndDistanceOptions(originAirport) {
    const response = await fetch('/two', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originAirport }),
    });

    if (response.ok) {
        const data = await response.json();
        const messageData = data.distinctAirports; // Adjust according to data received
        console.log("Client:");
        console.log(messageData);
    } 
    else {
        alert('Response from server not received');
    }
}

