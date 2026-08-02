const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'GEMINI_API_KEY'];
const envPath = path.join(__dirname, '../.env');

if (!fs.existsSync(envPath)) {
  console.error('Missing .env file! Create one based on .env.example');
  process.exit(1);
}

let parsedEnv = {};
try {
  const envBuffer = fs.readFileSync(envPath);
  parsedEnv = dotenv.parse(envBuffer);
} catch (err) {
  console.error('Failed to parse .env file:', err.message);
  process.exit(1);
}

const missing = [];
requiredEnv.forEach((key) => {
  const val = parsedEnv[key] !== undefined ? parsedEnv[key] : process.env[key];
  if (!val || typeof val !== 'string' || val.trim() === '') {
    missing.push(key);
  }
});

if (missing.length > 0) {
  console.error('Missing or unconfigured keys in .env:', missing.join(', '));
  process.exit(1);
}

console.log('Environment validation passed!');
