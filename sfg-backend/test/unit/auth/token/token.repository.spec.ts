import { Test, TestingModule } from '@nestjs/testing';
import { TokenRepository } from '../../../../src/auth/token/token.repository';
import { PrismaService } from '../../../../src/prisma/prisma.service';
import { MockFactories } from '../../utils/mock-factories';
import { createMockPrismaService } from '../../utils/jest-helpers';

describe('TokenRepository', () => {
  let repository: TokenRepository;
  let mockPrismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    mockPrismaService = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<TokenRepository>(TokenRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createToken', () => {
    it('should cover private method default parameter branch', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };

      // Create a spy to monitor how the private method is called
      const findFirstSpy = jest.spyOn(mockPrismaService.token, 'findFirst');

      mockPrismaService.token.findFirst.mockResolvedValue(null);
      mockPrismaService.token.create.mockResolvedValue(
        MockFactories.createTokenRecord({ ...tokenData, seq: 1 }),
      );

      // Act - Call createToken WITHOUT prismaClient to trigger default parameter
      await repository.createToken(tokenData);

      // This should trigger the branch where the private method uses `this.prisma`
      expect(findFirstSpy).toHaveBeenCalledWith({
        where: { userId: tokenData.userId },
        orderBy: { seq: 'desc' },
      });
    });

    // Also add this test to ensure we hit the other branch:
    it('should cover private method with explicit transaction client parameter', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };

      const mockTransactionClient = {
        token: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest
            .fn()
            .mockResolvedValue(MockFactories.createTokenRecord(tokenData)),
        },
      };

      // Act - Call createToken WITH explicit prismaClient
      await repository.createToken(tokenData, mockTransactionClient as any);

      // The private method should use the provided client, not the default
      expect(mockTransactionClient.token.findFirst).toHaveBeenCalledWith({
        where: { userId: tokenData.userId },
        orderBy: { seq: 'desc' },
      });

      // Default prisma should NOT be called
      expect(mockPrismaService.token.findFirst).not.toHaveBeenCalled();
    });
    it('should create a token with sequence number 1 when no tokens exist', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date('2024-01-01T12:00:00Z'),
      };
      const expectedTokenRecord = MockFactories.createTokenRecord({
        ...tokenData,
        seq: 1,
      });

      mockPrismaService.token.findFirst.mockResolvedValue(null); // No existing tokens
      mockPrismaService.token.create.mockResolvedValue(expectedTokenRecord);

      // Act
      const result = await repository.createToken(tokenData);

      // Assert
      expect(mockPrismaService.token.findFirst).toHaveBeenCalledWith({
        where: { userId: tokenData.userId },
        orderBy: { seq: 'desc' },
      });
      expect(mockPrismaService.token.create).toHaveBeenCalledWith({
        data: {
          ...tokenData,
          seq: 1,
        },
      });
      expect(result).toBe(expectedTokenRecord);
    });

    it('should create a token with incremented sequence number when tokens exist', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date('2024-01-01T12:00:00Z'),
      };
      const existingToken = MockFactories.createTokenRecord({
        userId: tokenData.userId,
        seq: 3,
      });
      const expectedSeq = 4;
      const expectedTokenRecord = MockFactories.createTokenRecord({
        ...tokenData,
        seq: expectedSeq,
      });

      mockPrismaService.token.findFirst.mockResolvedValue(existingToken);
      mockPrismaService.token.create.mockResolvedValue(expectedTokenRecord);

      // Act
      const result = await repository.createToken(tokenData);

      // Assert
      expect(mockPrismaService.token.findFirst).toHaveBeenCalledWith({
        where: { userId: tokenData.userId },
        orderBy: { seq: 'desc' },
      });
      expect(mockPrismaService.token.create).toHaveBeenCalledWith({
        data: {
          ...tokenData,
          seq: expectedSeq,
        },
      });
      expect(result).toBe(expectedTokenRecord);
    });

    it('should handle different user IDs correctly', async () => {
      // Arrange
      const tokenData = {
        userId: 'different-user-id',
        token: 'different-token',
        expiresAt: new Date('2024-01-01T12:00:00Z'),
      };

      mockPrismaService.token.findFirst.mockResolvedValue(null);
      mockPrismaService.token.create.mockResolvedValue(
        MockFactories.createTokenRecord(tokenData),
      );

      // Act
      await repository.createToken(tokenData);

      // Assert
      expect(mockPrismaService.token.findFirst).toHaveBeenCalledWith({
        where: { userId: 'different-user-id' },
        orderBy: { seq: 'desc' },
      });
    });

    it('should throw error when findFirst fails', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };
      const findError = new Error('Database find error');

      mockPrismaService.token.findFirst.mockRejectedValue(findError);

      // Act & Assert
      await expect(repository.createToken(tokenData)).rejects.toThrow(
        findError,
      );
      expect(mockPrismaService.token.create).not.toHaveBeenCalled();
    });

    it('should throw error when create fails', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };
      const createError = new Error('Database create error');

      mockPrismaService.token.findFirst.mockResolvedValue(null);
      mockPrismaService.token.create.mockRejectedValue(createError);

      // Act & Assert
      await expect(repository.createToken(tokenData)).rejects.toThrow(
        createError,
      );
    });

    it('should handle sequence starting from 0 correctly', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };
      const existingTokenWithSeq0 = MockFactories.createTokenRecord({
        userId: tokenData.userId,
        seq: 0,
      });

      mockPrismaService.token.findFirst.mockResolvedValue(
        existingTokenWithSeq0,
      );
      mockPrismaService.token.create.mockResolvedValue(
        MockFactories.createTokenRecord({
          ...tokenData,
          seq: 1,
        }),
      );

      // Act
      await repository.createToken(tokenData);

      // Assert
      expect(mockPrismaService.token.create).toHaveBeenCalledWith({
        data: {
          ...tokenData,
          seq: 1,
        },
      });
    });

    it('should use default prisma client when none provided', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };
      const expectedTokenRecord = MockFactories.createTokenRecord({
        ...tokenData,
        seq: 1,
      });

      // Mock the default prisma service calls
      mockPrismaService.token.findFirst.mockResolvedValue(null);
      mockPrismaService.token.create.mockResolvedValue(expectedTokenRecord);

      // Act - Call without prismaClient parameter to use default
      const result = await repository.createToken(tokenData);

      // Assert - Should use the injected prisma service
      expect(mockPrismaService.token.findFirst).toHaveBeenCalledWith({
        where: { userId: tokenData.userId },
        orderBy: { seq: 'desc' },
      });
      expect(mockPrismaService.token.create).toHaveBeenCalledWith({
        data: {
          ...tokenData,
          seq: 1,
        },
      });
      expect(result).toBe(expectedTokenRecord);
    });

    it('should use custom prisma client when provided', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };
      const mockTransactionClient = {
        token: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest
            .fn()
            .mockResolvedValue(MockFactories.createTokenRecord(tokenData)),
        },
      };

      // Act - Call WITH prismaClient parameter
      await repository.createToken(tokenData, mockTransactionClient as any);

      // Assert - Should use the provided transaction client
      expect(mockTransactionClient.token.findFirst).toHaveBeenCalledWith({
        where: { userId: tokenData.userId },
        orderBy: { seq: 'desc' },
      });
      expect(mockTransactionClient.token.create).toHaveBeenCalledWith({
        data: {
          ...tokenData,
          seq: 1,
        },
      });

      // Should NOT call the default prisma service
      expect(mockPrismaService.token.findFirst).not.toHaveBeenCalled();
      expect(mockPrismaService.token.create).not.toHaveBeenCalled();
    });

    it('should handle large sequence numbers correctly', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };
      const largeSeq = 9999;
      const existingToken = MockFactories.createTokenRecord({
        userId: tokenData.userId,
        seq: largeSeq,
      });

      mockPrismaService.token.findFirst.mockResolvedValue(existingToken);
      mockPrismaService.token.create.mockResolvedValue(
        MockFactories.createTokenRecord({
          ...tokenData,
          seq: largeSeq + 1,
        }),
      );

      // Act
      await repository.createToken(tokenData);

      // Assert
      expect(mockPrismaService.token.create).toHaveBeenCalledWith({
        data: {
          ...tokenData,
          seq: largeSeq + 1,
        },
      });
    });

    it('should work with transaction client', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };
      const mockTransactionClient = {
        token: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest
            .fn()
            .mockResolvedValue(MockFactories.createTokenRecord(tokenData)),
        },
      };

      // Act
      await repository.createToken(tokenData, mockTransactionClient as any);

      // Assert
      expect(mockTransactionClient.token.findFirst).toHaveBeenCalledWith({
        where: { userId: tokenData.userId },
        orderBy: { seq: 'desc' },
      });
      expect(mockTransactionClient.token.create).toHaveBeenCalledWith({
        data: {
          ...tokenData,
          seq: 1,
        },
      });
      // Should not call the main prisma service
      expect(mockPrismaService.token.findFirst).not.toHaveBeenCalled();
      expect(mockPrismaService.token.create).not.toHaveBeenCalled();
    });

    it('should handle null token response correctly (branch coverage for ?? operator)', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };

      // Test the ?? operator when latest is null
      mockPrismaService.token.findFirst.mockResolvedValue(null);
      mockPrismaService.token.create.mockResolvedValue(
        MockFactories.createTokenRecord({
          ...tokenData,
          seq: 1,
        }),
      );

      // Act
      await repository.createToken(tokenData);

      // Assert - Should create with seq 1 when no previous tokens exist
      expect(mockPrismaService.token.create).toHaveBeenCalledWith({
        data: {
          ...tokenData,
          seq: 1,
        },
      });
    });

    it('should handle existing token response correctly (branch coverage for ?. operator)', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };
      const existingToken = MockFactories.createTokenRecord({
        userId: tokenData.userId,
        seq: 5,
      });

      // Test the ?. operator when latest exists
      mockPrismaService.token.findFirst.mockResolvedValue(existingToken);
      mockPrismaService.token.create.mockResolvedValue(
        MockFactories.createTokenRecord({
          ...tokenData,
          seq: 6,
        }),
      );

      // Act
      await repository.createToken(tokenData);

      // Assert - Should create with seq 6 when latest seq is 5
      expect(mockPrismaService.token.create).toHaveBeenCalledWith({
        data: {
          ...tokenData,
          seq: 6,
        },
      });
    });

    it('should call private findLastestTokenForUser through transaction client', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };
      const mockTransactionClient = {
        token: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest
            .fn()
            .mockResolvedValue(MockFactories.createTokenRecord(tokenData)),
        },
      };

      // Act - This ensures the private method is called with transaction client
      await repository.createToken(tokenData, mockTransactionClient as any);

      // Assert - The private method should be called with the transaction client
      expect(mockTransactionClient.token.findFirst).toHaveBeenCalledWith({
        where: { userId: tokenData.userId },
        orderBy: { seq: 'desc' },
      });
    });
  });

  describe('findLatestSeqForUser (through createToken)', () => {
    it('should return 0 when no existing tokens (testing ?? operator)', async () => {
      // Arrange
      const tokenData = {
        userId: 'new-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };

      // Mock findFirst to return null (no existing tokens)
      mockPrismaService.token.findFirst.mockResolvedValue(null);
      mockPrismaService.token.create.mockResolvedValue(
        MockFactories.createTokenRecord({ ...tokenData, seq: 1 }),
      );

      // Act - This will trigger the private methods
      await repository.createToken(tokenData);

      // Assert - Should create with seq 1 (0 + 1)
      expect(mockPrismaService.token.create).toHaveBeenCalledWith({
        data: { ...tokenData, seq: 1 },
      });
    });

    it('should return existing seq when tokens exist (testing ?. operator)', async () => {
      // Arrange
      const tokenData = {
        userId: 'existing-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };
      const existingToken = MockFactories.createTokenRecord({
        userId: tokenData.userId,
        seq: 7,
      });

      // Mock findFirst to return existing token
      mockPrismaService.token.findFirst.mockResolvedValue(existingToken);
      mockPrismaService.token.create.mockResolvedValue(
        MockFactories.createTokenRecord({ ...tokenData, seq: 8 }),
      );

      // Act - This will trigger the private methods
      await repository.createToken(tokenData);

      // Assert - Should create with seq 8 (7 + 1)
      expect(mockPrismaService.token.create).toHaveBeenCalledWith({
        data: { ...tokenData, seq: 8 },
      });
    });
  });

  // ADD TESTS FOR PRIVATE METHOD DEFAULT PARAMETERS:
  describe('private method default parameter coverage', () => {
    it('should use default prisma client in private methods', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };

      mockPrismaService.token.findFirst.mockResolvedValue(null);
      mockPrismaService.token.create.mockResolvedValue(
        MockFactories.createTokenRecord(tokenData),
      );

      // Act - Call without transaction client (uses default)
      await repository.createToken(tokenData);

      // Assert - Private methods should use default prisma client
      expect(mockPrismaService.token.findFirst).toHaveBeenCalledWith({
        where: { userId: tokenData.userId },
        orderBy: { seq: 'desc' },
      });
    });

    it('should use custom prisma client in private methods', async () => {
      // Arrange
      const tokenData = {
        userId: 'test-user-id',
        token: 'test-token',
        expiresAt: new Date(),
      };
      const mockTransactionClient = {
        token: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest
            .fn()
            .mockResolvedValue(MockFactories.createTokenRecord(tokenData)),
        },
      };

      // Act - Call with transaction client
      await repository.createToken(tokenData, mockTransactionClient as any);

      // Assert - Private methods should use provided transaction client
      expect(mockTransactionClient.token.findFirst).toHaveBeenCalledWith({
        where: { userId: tokenData.userId },
        orderBy: { seq: 'desc' },
      });

      // Should NOT use default prisma client
      expect(mockPrismaService.token.findFirst).not.toHaveBeenCalled();
    });
  });
});
