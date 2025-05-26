const axios = require('axios');

const testQuery = {
  name: "Test User",
  email: "test@example.com",
  subject: "Test Query",
  message: "This is a test query message"
};

async function testSubmitQuery() {
  try {
    console.log('Submitting query:', testQuery);
    const response = await axios.post('http://localhost:5001/api/queries', testQuery, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response:', response.data);
    
    if (response.data.success) {
      console.log('Query submitted successfully!');
      console.log('Query ID:', response.data.data._id);
      console.log('Status:', response.data.data.status);
    } else {
      console.error('Failed to submit query:', response.data.error);
    }
  } catch (error) {
    console.error('Error submitting query:');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.message);
    } else {
      console.error('Error setting up request:', error.message);
    }
  }
}

testSubmitQuery();
