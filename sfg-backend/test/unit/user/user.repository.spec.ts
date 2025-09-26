import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../../src/user/user.repository';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { MockFactories } from '../utils/mock-factories';
import { createMockPrismaService } from '../utils/jest-helpers';
describe('UserRepository', () => {
  let repository: UserRepository;
  let mockPrismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    mockPrismaService = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  describe('findUser', () => {
    it('should find user by email using default prisma client', async () => {
      // Arrange
      const mockUser = MockFactories.createUserRecord();
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      // Act - Don't provide prismaClient parameter to use default
      const result = await repository.findUser('email', 'test@example.com');

      // Assert
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should find user by email using custom prisma client', async () => {
      // Arrange
      const mockTransactionClient = { user: { findFirst: jest.fn() } };
      const mockUser = MockFactories.createUserRecord();
      mockTransactionClient.user.findFirst.mockResolvedValue(mockUser);

      // Act - Provide custom prismaClient
      const result = await repository.findUser(
        'userId',
        'test-id',
        mockTransactionClient as any,
      );

      // Assert
      expect(mockTransactionClient.user.findFirst).toHaveBeenCalledWith({
        where: { userId: 'test-id' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      // Arrange
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      // Act - Test default client with null result
      const result = await repository.findUser(
        'email',
        'nonexistent@example.com',
      );

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findUserByUnique', () => {
    it('should find user by unique constraint using default client', async () => {
      // Arrange
      const mockUser = MockFactories.createUserRecord();
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act - Use default client
      const result = await repository.findUserByUnique({ userId: 'test-id' });

      // Assert
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { userId: 'test-id' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should find user by unique constraint using custom client', async () => {
      // Arrange
      const mockTransactionClient = { user: { findUnique: jest.fn() } };
      const mockUser = MockFactories.createUserRecord();
      mockTransactionClient.user.findUnique.mockResolvedValue(mockUser);

      // Act - Use custom client
      const result = await repository.findUserByUnique(
        { userId: 'test-id' },
        mockTransactionClient as any,
      );

      // Assert
      expect(mockTransactionClient.user.findUnique).toHaveBeenCalledWith({
        where: { userId: 'test-id' },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('createUser', () => {
    it('should create new user using default client', async () => {
      // Arrange
      const mockUser = MockFactories.createUserRecord();
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      // Act - Use default client
      const result = await repository.createUser({ email: 'new@example.com' });

      // Assert
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { email: 'new@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should create new user using custom client', async () => {
      // Arrange
      const mockTransactionClient = { user: { create: jest.fn() } };
      const mockUser = MockFactories.createUserRecord();
      mockTransactionClient.user.create.mockResolvedValue(mockUser);

      // Act - Use custom client
      const result = await repository.createUser(
        { email: 'new@example.com' },
        mockTransactionClient as any,
      );

      // Assert
      expect(mockTransactionClient.user.create).toHaveBeenCalledWith({
        data: { email: 'new@example.com' },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
