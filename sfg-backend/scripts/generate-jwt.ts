import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

// Read .env file and extract JWT_SECRET
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const secretMatch = envContent.match(/JWT_SECRET=(.*)/);
if (!secretMatch) {
    throw new Error('JWT_SECRET not found in .env');
}
const JWT_SECRET = secretMatch[1].trim();

// Example payload (customize as needed)
const payload = {
    sub: 'user-id', // Replace with actual user id
    username: 'exampleuser', // Replace with actual username
    email: 'user@example.com', // Replace with actual email
    // Add any other claims you want
};

// Generate a JWT that does not expire
const token = jwt.sign(payload, JWT_SECRET, {
    // no expiresIn field means no expiration
});

console.log('Generated JWT:');
console.log(token);
