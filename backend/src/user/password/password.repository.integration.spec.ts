import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordRepository } from './password.repository';
import { v4 as uuidv4 } from 'uuid';
import { PrismaModule } from 'src/prisma/prisma.module';
import clearDatabase from 'src/test/integration/utils/clearDatabase';

describe('PasswordRepository (integration)', () => {
  let prisma: PrismaService;
  let repo: PasswordRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaService, PasswordRepository],
    }).compile();

    prisma = module.get(PrismaService);
    repo = module.get(PasswordRepository);
    await prisma.$connect();
  });

  afterAll(async () => {
    clearDatabase(prisma);
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
  });

  it('should create a password record', async () => {
    const userId = uuidv4();
    await prisma.user.create({
      data: {
        id: userId,
        userName: 'testuser1',
        email: 'test1@example.com',
      },
    });
    const password = await repo.create({
      data: { userId, hash: 'hashedpw' },
    });
    expect(password).toMatchObject({ userId, hash: 'hashedpw' });
  });

  it('should find a password by unique', async () => {
    const userId = uuidv4();
    await prisma.user.create({
      data: {
        id: userId,
        userName: 'testuser2',
        email: 'test2@example.com',
      },
    });
    await repo.create({ data: { userId, hash: 'pw2' } });
    const found = await repo.findByUnique({ where: { userId } });
    expect(found).not.toBeNull();
    expect(found?.hash).toBe('pw2');
  });

  it('should update a password hash', async () => {
    const userId = uuidv4();
    await prisma.user.create({
      data: {
        id: userId,
        userName: 'testuser3',
        email: 'test3@example.com',
      },
    });
    await repo.create({ data: { userId, hash: 'old' } });
    const updated = await repo.setPassword({
      where: { userId },
      data: { hashedPassword: 'newhash' },
    });
    expect(updated.hash).toBe('newhash');
  });
});
