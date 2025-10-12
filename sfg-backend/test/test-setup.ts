import * as dotenv from 'dotenv';
import * as path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// Safety check
if (!process.env.DATABASE_URL?.includes('sfg_test')) {
  console.error('❌ Current DATABASE_URL:', process.env.DATABASE_URL);
  throw new Error('❌ Integration tests must use sfg_test database');
}

// Store original console methods
const originalConsoleError = console.error;
