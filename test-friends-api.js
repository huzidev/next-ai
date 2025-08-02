// Simple test script for friends API endpoints
const https = require('http');

const testEndpoint = (path, method = 'GET', headers = {}) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`${method} ${path}:`, jsonData);
          resolve(jsonData);
        } catch (error) {
          console.error(`${method} ${path} - JSON Parse Error:`, error.message);
          console.error('Raw response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`${method} ${path} - Request Error:`, error.message);
      reject(error);
    });

    req.end();
  });
};

async function testFriendsAPI() {
  console.log('Testing Friends API endpoints...\n');

  try {
    // Test friends list endpoint
    await testEndpoint('/api/friends/list');
    
    // Test friends status endpoint  
    await testEndpoint('/api/friends/status');
    
    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testFriendsAPI();
