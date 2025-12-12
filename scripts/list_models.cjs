
const https = require('https');

const API_KEY = 'AIzaSyD2U6g339vbZNfRgRnEwjYPB9xlJpU-meU'; // Hardcoded for this test script

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models?key=${API_KEY}`,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log('AVAILABLE MODELS:');
                json.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods})`));
            } else {
                console.log('NO MODELS FOUND. Response:', JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.log('Raw response:', data);
        }
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.end();
