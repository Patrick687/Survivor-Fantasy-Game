// scripts/run-e2e-tests.ts
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

// Get command line arguments for specific test patterns
const args = process.argv.slice(2);
const testPattern = args.find(
  (arg) => arg.startsWith('--testNamePattern=') || arg.startsWith('-t='),
);
const testSuite = args.find(
  (arg) => !arg.startsWith('--') && !arg.startsWith('-'),
);

async function runE2ETests() {
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
    execSync('npx prisma generate', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL },
    });

    console.log('✅ Database setup complete!');
    console.log('🧪 Running E2E tests...');

    // Build Jest command
    let jestCommand = 'jest --config ./test/jest-e2e.json';

    // Add test pattern if specified
    if (testPattern) {
      const pattern = testPattern.split('=')[1];
      jestCommand += ` --testNamePattern="${pattern}"`;
    }

    // Add test file pattern if specified
    if (testSuite) {
      jestCommand += ` --testPathPattern="${testSuite}"`;
    }

    // Add any other Jest arguments
    const otherArgs = args.filter(
      (arg) =>
        !arg.startsWith('--testNamePattern=') &&
        !arg.startsWith('-t=') &&
        arg !== testSuite,
    );

    if (otherArgs.length > 0) {
      jestCommand += ` ${otherArgs.join(' ')}`;
    }

    console.log(`🎯 Running: ${jestCommand}`);

    // Run Jest
    execSync(jestCommand, {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL },
    });

    console.log('✅ All tests completed!');
  } catch (error) {
    console.error('❌ Tests failed:', error);
    process.exit(1);
  }
}

runE2ETests();
