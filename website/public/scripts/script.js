function testNextPage() {
    window.location.href = "/userInformation.html"
}

function allOriginAirportsCall() {
    allOriginAirports();
}

async function allOriginAirports() {
    const response = await fetch('/one');

    if (response.ok) {
        const data = await response.json();
        const distinctAirports = data.distinctAirports;
        console.log("Client:");
        console.log(distinctAirports);
    } 
    else {
        alert('Response from server not received');
    }
}

function priceRangeAndDistanceOptionsCall() {
    var originAirport = "XXXX"
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

