const { execSync } = require('child_process');
const path = require('path');
const { Client } = require('pg');

async function waitForPostgres(
  { host, port, user, password, database },
  retries = 10,
  delay = 1000,
) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = new Client({ host, port, user, password, database });
      await client.connect();
      await client.end();
      return;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

const jestIntegrationGlobalSetup = async () => {
  execSync('docker-compose -f docker-compose.test.yml up -d', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname),
  });

  // Wait for Postgres to be ready
  await waitForPostgres({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: 'postgres',
    database: 'sfg_test',
  });

  execSync('dotenv -e .env.test -- prisma migrate deploy', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../..'),
  });
};

export default jestIntegrationGlobalSetup;
