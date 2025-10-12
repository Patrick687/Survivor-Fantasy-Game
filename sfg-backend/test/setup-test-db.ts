import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load test environment
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL?.includes('sfg_test')) {
  console.error('❌ DATABASE_URL must point to sfg_test database');
  process.exit(1);
}

async function setupTestDatabase() {
  try {
    console.log('🗄️  Setting up sfg_test database...');

    // Reset the test database schema
    console.log('🔄 Resetting database schema...');
    execSync('npx prisma db push --force-reset --accept-data-loss', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL },
    });

    // Generate Prisma client
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    console.log('✅ sfg_test database setup complete!');
  } catch (error) {
    console.error('❌ Test database setup failed:', error);
    process.exit(1);
  }
}

setupTestDatabase();
