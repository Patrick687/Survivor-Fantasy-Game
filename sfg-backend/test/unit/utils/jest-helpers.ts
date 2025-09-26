export const createMockRepository = <T = any>() => ({
  // Standard Prisma CRUD methods
  create: jest.fn(),
  createMany: jest.fn(),
  findFirst: jest.fn(),
  findFirstOrThrow: jest.fn(),
  findUnique: jest.fn(),
  findUniqueOrThrow: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  updateMany: jest.fn(),
  upsert: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  count: jest.fn(),
  aggregate: jest.fn(),
  groupBy: jest.fn(),

  // Custom repository methods (keep these for backward compatibility)
  findOne: jest.fn(),
  createUser: jest.fn(),
  findByEmailOrUserName: jest.fn(),
  getProfile: jest.fn(),
  createProfile: jest.fn(),
});

export const createMockService = <T = any>() => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createUser: jest.fn(),
  validateUser: jest.fn(),
  getProfile: jest.fn(),
  createProfile: jest.fn(),
  generateToken: jest.fn(),
  hashPassword: jest.fn(),
  validatePassword: jest.fn(),
});

export const createMockPrismaService = () => ({
  user: createMockRepository(),
  profile: createMockRepository(),
  token: createMockRepository(),
  $transaction: jest.fn(),
  $executeRaw: jest.fn(),
  $queryRaw: jest.fn(),
  $connect: jest.fn(),
  $disconnect: jest.fn(),
});
