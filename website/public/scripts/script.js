function testNextPage() {
    toServerTest("Hello");
    //window.location.href = "/userInformation.html"
}

async function toServerTest(testingString) {
    const response = await fetch('/test', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testingString }),
    });

    if (response.ok) {
        const data = await response.json();
        const messageData = data.distinctAirports;
        console.log("Client:");
        console.log(messageData);
    } 
    else {
        alert('Response from server not received');
    }
}