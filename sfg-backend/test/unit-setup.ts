import 'reflect-metadata';

// Mock Prisma globally for unit tests
jest.mock('../src/prisma/prisma.service');

// Global test utilities and mocks can go here
global.console = {
  ...console,
  // Uncomment to silence console.log during tests
  // log: jest.fn(),
  // debug: jest.fn(),
};

// Set test timeout
jest.setTimeout(10000);
