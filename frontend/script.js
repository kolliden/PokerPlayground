// Add functionality here using JavaScript
document.getElementById('dealBtn').addEventListener('click', function() {
    // Functionality to deal cards
    // This could involve generating random cards for players and community cards
  });

  // Add other event listeners for fold, check, raise, etc.
// Replace 'API_ENDPOINT' with the URL of the API you want to call
const apiUrl = 'localhost:8000/api/flag';

const dataToSend = {
  key1: 'value1',
  key2: 'value2'
};

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json', // Specify content type as JSON
    // Add any other headers if needed
  },
  body: JSON.stringify(dataToSend) // Convert data to JSON format
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Handle the response data
    console.log('POST request successful:', data);
  })
  .catch(error => {
    // Handle errors
    console.error('There was a problem with the POST request:', error);
  });