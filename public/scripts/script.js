function testNextPage() {
  window.location.href = "/userInformation.html"
}

function testMongo() {
 fetch('/data')
        .then(response => response.json())
        .then(data => {
          const dataContainer = document.getElementById('data');
          dataContainer.innerHTML = '<h3>Data from MongoDB:</h3>';
          dataContainer.innerHTML += '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        })
        .catch(error => console.error('Error fetching data:', error));
}