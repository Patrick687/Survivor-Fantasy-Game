const { execSync } = require('child_process');
const path = require('path');

const jestIntegrationGlobalTeardown = async () => {
  execSync('docker-compose -f docker-compose.test.yml down -v', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname),
  });
};

export default jestIntegrationGlobalTeardown;
