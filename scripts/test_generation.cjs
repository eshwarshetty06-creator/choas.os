
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyD2U6g339vbZNfRgRnEwjYPB9xlJpU-meU';
const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
    const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-pro'];

    for (const modelName of models) {
        console.log(`Testing ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Hello, are you working?');
            const response = await result.response;
            console.log(`SUCCESS [${modelName}]:`, response.text());
            process.exit(0);
        } catch (e) {
            console.error(`FAILED [${modelName}]:`, e.message);
        }
    }
}

run();
