import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from './user.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { v4 as uuidv4 } from 'uuid';
import clearDatabase from 'src/test/integration/utils/clearDatabase';

describe('UserRepository (integration)', () => {
  let prisma: PrismaService;
  let repo: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaService, UserRepository],
    }).compile();

    prisma = module.get(PrismaService);
    repo = module.get(UserRepository);
    await prisma.$connect();
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
  });

  afterAll(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  it('should create a user', async () => {
    const userId = uuidv4();
    const userName = `u_${userId.replace(/-/g, '').slice(0, 22)}`; // 2 + 22 = 24 chars
    const email = `t_${userId.replace(/-/g, '').slice(0, 20)}@ex.com`; // well under 255 chars

    const user = await repo.create({
      data: {
        id: userId,
        userName,
        email,
        firstName: 'Test',
        lastName: 'User',
        isPrivate: false,
      },
    });
    expect(user).toMatchObject({
      id: userId,
      userName,
      email,
      firstName: 'Test',
      lastName: 'User',
      isPrivate: false,
    });
  });

  it('should find a user by unique (username, case-insensitive)', async () => {
    const userId = uuidv4();
    await prisma.user.create({
      data: {
        id: userId,
        userName: 'TestUser2',
        email: 'test@mail.com',
      },
    });
    const found = await repo.findByUnique({ where: { userName: 'testuser2' } });
    expect(found).not.toBeNull();
    expect(found?.userName).toBe('TestUser2');
  });

  it('should find a user by unique (email, case-insensitive)', async () => {
    const userId = uuidv4();
    await prisma.user.create({
      data: {
        id: userId,
        userName: 'testuser3',
        email: 'Test3@Example.com',
      },
    });
    const found = await repo.findByUnique({
      where: { email: 'test3@example.com' },
    });
    expect(found).not.toBeNull();
    expect(found?.email).toBe('Test3@Example.com');
  });

  it('should find a user by username or email (case-insensitive)', async () => {
    const userId = uuidv4();
    await prisma.user.create({
      data: {
        id: userId,
        userName: 'TestUser4',
        email: 'Test4@Example.com',
      },
    });
    const foundByUsername = await repo.findByUsernameOrEmail('testuser4');
    expect(foundByUsername).not.toBeNull();
    expect(foundByUsername?.userName).toBe('TestUser4');

    const foundByEmail = await repo.findByUsernameOrEmail('test4@example.com');
    expect(foundByEmail).not.toBeNull();
    expect(foundByEmail?.email).toBe('Test4@Example.com');
  });

  it('should update a user', async () => {
    const userId = uuidv4();
    await prisma.user.create({
      data: {
        id: userId,
        userName: 'testuser5',
        email: 'test5@example.com',
        firstName: 'Old',
      },
    });
    const updated = await repo.update({
      where: { id: userId },
      data: { firstName: 'New' },
    });
    expect(updated.firstName).toBe('New');
  });
});
