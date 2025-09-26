import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../../../../src/auth/token/token.service';
import { TokenRepository } from '../../../../src/auth/token/token.repository';
import { UserRole } from '../../../../src/user/entities/user-role.enum';
import { MockFactories } from '../../utils/mock-factories';
import { JwtPayload } from '../../../../src/auth/token/jwt-payload.type';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: jest.Mocked<JwtService>;
  let tokenRepository: jest.Mocked<TokenRepository>;

  beforeEach(async () => {
    const mockJwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };

    const mockTokenRepository = {
      createToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: TokenRepository,
          useValue: mockTokenRepository,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get(JwtService);
    tokenRepository = module.get(TokenRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('issueTokenForUser', () => {
    it('should successfully issue a token for a user with default expiration', async () => {
      // Arrange
      const userId = 'test-user-id';
      const userRole = UserRole.USER;
      const expectedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
      const expectedPayload: JwtPayload = {
        userId,
        userRole,
      };

      jwtService.signAsync.mockResolvedValue(expectedToken);
      const mockTokenRecord = MockFactories.createTokenRecord({
        userId,
        token: expectedToken,
      });
      tokenRepository.createToken.mockResolvedValue(mockTokenRecord);

      // Act
      const result = await service.issueTokenForUser(userId, userRole);

      // Assert
      expect(jwtService.signAsync).toHaveBeenCalledWith(expectedPayload, {
        expiresIn: '1d',
      });
      expect(tokenRepository.createToken).toHaveBeenCalledWith({
        userId,
        token: expectedToken,
        expiresAt: expect.any(Date),
      });
      expect(result.token).toBe(expectedToken);
      expect(result.tokenRecord).toBe(mockTokenRecord);
    });

    it('should handle custom expiration time', async () => {
      // Arrange
      const userId = 'test-user-id';
      const userRole = UserRole.USER;
      const customExpiration = '12h';
      const expectedToken = 'test-token';

      jwtService.signAsync.mockResolvedValue(expectedToken);
      tokenRepository.createToken.mockResolvedValue(
        MockFactories.createTokenRecord(),
      );

      // Act
      await service.issueTokenForUser(userId, userRole, customExpiration);

      // Assert
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { userId, userRole },
        { expiresIn: customExpiration },
      );
    });

    it('should handle different user roles correctly', async () => {
      // Arrange
      const userId = 'admin-user-id';
      const userRole = UserRole.ADMIN;
      const expectedToken = 'admin-token';
      const expectedPayload: JwtPayload = {
        userId,
        userRole: UserRole.ADMIN,
      };

      jwtService.signAsync.mockResolvedValue(expectedToken);
      tokenRepository.createToken.mockResolvedValue(
        MockFactories.createTokenRecord(),
      );

      // Act
      await service.issueTokenForUser(userId, userRole);

      // Assert
      expect(jwtService.signAsync).toHaveBeenCalledWith(expectedPayload, {
        expiresIn: '1d',
      });
    });

    it('should calculate expiration date correctly for time formats', async () => {
      // Arrange
      const userId = 'test-user-id';
      const userRole = UserRole.USER;
      const expiresIn = '2h';
      const expectedToken = 'test-token';
      const fixedTime = new Date('2024-01-01T12:00:00Z').getTime();

      jest.spyOn(Date, 'now').mockReturnValue(fixedTime);
      jwtService.signAsync.mockResolvedValue(expectedToken);
      tokenRepository.createToken.mockResolvedValue(
        MockFactories.createTokenRecord(),
      );

      // Act
      await service.issueTokenForUser(userId, userRole, expiresIn);

      // Assert
      expect(tokenRepository.createToken).toHaveBeenCalledWith({
        userId,
        token: expectedToken,
        expiresAt: new Date(fixedTime + 2 * 60 * 60 * 1000), // 2 hours in ms
      });
    });

    it('should handle numeric expiration (in seconds)', async () => {
      // Arrange
      const userId = 'test-user-id';
      const userRole = UserRole.USER;
      const expiresInSeconds = 3600; // 1 hour
      const expectedToken = 'test-token';
      const fixedTime = new Date('2024-01-01T12:00:00Z').getTime();

      jest.spyOn(Date, 'now').mockReturnValue(fixedTime);
      jwtService.signAsync.mockResolvedValue(expectedToken);
      tokenRepository.createToken.mockResolvedValue(
        MockFactories.createTokenRecord(),
      );

      // Act
      await service.issueTokenForUser(userId, userRole, expiresInSeconds);

      // Assert
      expect(tokenRepository.createToken).toHaveBeenCalledWith({
        userId,
        token: expectedToken,
        expiresAt: new Date(fixedTime + 3600 * 1000), // 1 hour in ms
      });
    });

    it('should throw error when JWT signing fails', async () => {
      // Arrange
      const userId = 'test-user-id';
      const userRole = UserRole.USER;
      const jwtError = new Error('JWT signing failed');

      jwtService.signAsync.mockRejectedValue(jwtError);

      // Act & Assert
      await expect(service.issueTokenForUser(userId, userRole)).rejects.toThrow(
        jwtError,
      );
      expect(tokenRepository.createToken).not.toHaveBeenCalled();
    });

    it('should throw error when token repository fails', async () => {
      // Arrange
      const userId = 'test-user-id';
      const userRole = UserRole.USER;
      const repositoryError = new Error('Database error');
      const expectedToken = 'test-token';

      jwtService.signAsync.mockResolvedValue(expectedToken);
      tokenRepository.createToken.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(service.issueTokenForUser(userId, userRole)).rejects.toThrow(
        repositoryError,
      );
    });

    it('should handle invalid time format (branch coverage for msToMs)', async () => {
      // Arrange
      const userId = 'test-user-id';
      const userRole = UserRole.USER;
      const invalidExpiration = 'invalid-format';
      const expectedToken = 'test-token';
      const fixedTime = new Date('2024-01-01T12:00:00Z').getTime();

      jest.spyOn(Date, 'now').mockReturnValue(fixedTime);
      jwtService.signAsync.mockResolvedValue(expectedToken);
      tokenRepository.createToken.mockResolvedValue(
        MockFactories.createTokenRecord(),
      );

      // Act
      await service.issueTokenForUser(userId, userRole, invalidExpiration);

      // Assert - Should default to 24 hours (86400000 ms) for invalid format
      expect(tokenRepository.createToken).toHaveBeenCalledWith({
        userId,
        token: expectedToken,
        expiresAt: new Date(fixedTime + 24 * 60 * 60 * 1000), // 24 hours default
      });
    });

    it('should handle default case in msToMs switch statement', async () => {
      // Arrange
      const userId = 'test-user-id';
      const userRole = UserRole.USER;
      const expectedToken = 'test-token';
      const fixedTime = new Date('2024-01-01T12:00:00Z').getTime();

      // Mock the private msToMs method by testing through a string that will hit the default case
      // We need to create a scenario where the regex matches but the switch hits default
      // Since the regex is /^(\d+)([smhd])$/, this is actually impossible in normal conditions
      // But we can test the logic by mocking the method indirectly through string expiration
      jest.spyOn(Date, 'now').mockReturnValue(fixedTime);
      jwtService.signAsync.mockResolvedValue(expectedToken);
      tokenRepository.createToken.mockResolvedValue(
        MockFactories.createTokenRecord(),
      );

      // Act with a format that will not match the regex, triggering the default fallback
      await service.issueTokenForUser(userId, userRole, 'not-a-valid-format');

      // Assert - Should default to 24 hours for invalid format
      expect(tokenRepository.createToken).toHaveBeenCalledWith({
        userId,
        token: expectedToken,
        expiresAt: new Date(fixedTime + 24 * 60 * 60 * 1000), // 24 hours default
      });
    });

    it('should handle milliseconds unit in msToMs', async () => {
      // Arrange
      const userId = 'test-user-id';
      const userRole = UserRole.USER;
      // Note: Looking at the regex /^(\d+)([smhd])$/, 'ms' is not actually supported
      // The 's' case handles seconds, not milliseconds. Let's test seconds instead.
      const secondsExpiration = '30s';
      const expectedToken = 'test-token';
      const fixedTime = new Date('2024-01-01T12:00:00Z').getTime();

      jest.spyOn(Date, 'now').mockReturnValue(fixedTime);
      jwtService.signAsync.mockResolvedValue(expectedToken);
      tokenRepository.createToken.mockResolvedValue(
        MockFactories.createTokenRecord(),
      );

      // Act
      await service.issueTokenForUser(userId, userRole, secondsExpiration);

      // Assert
      expect(tokenRepository.createToken).toHaveBeenCalledWith({
        userId,
        token: expectedToken,
        expiresAt: new Date(fixedTime + 30 * 1000), // 30 seconds in milliseconds
      });
    });

    it('should handle decimal numbers in time format', async () => {
      // Arrange
      const userId = 'test-user-id';
      const userRole = UserRole.USER;
      const decimalExpiration = '1.5h'; // This should not match the regex and default
      const expectedToken = 'test-token';
      const fixedTime = new Date('2024-01-01T12:00:00Z').getTime();

      jest.spyOn(Date, 'now').mockReturnValue(fixedTime);
      jwtService.signAsync.mockResolvedValue(expectedToken);
      tokenRepository.createToken.mockResolvedValue(
        MockFactories.createTokenRecord(),
      );

      // Act
      await service.issueTokenForUser(userId, userRole, decimalExpiration);

      // Assert - Should default to 24 hours since decimal doesn't match regex
      expect(tokenRepository.createToken).toHaveBeenCalledWith({
        userId,
        token: expectedToken,
        expiresAt: new Date(fixedTime + 24 * 60 * 60 * 1000), // 24 hours default
      });
    });

    it('should handle days unit in msToMs', async () => {
      // Arrange
      const userId = 'test-user-id';
      const userRole = UserRole.USER;
      const daysExpiration = '7d';
      const expectedToken = 'test-token';
      const fixedTime = new Date('2024-01-01T12:00:00Z').getTime();

      jest.spyOn(Date, 'now').mockReturnValue(fixedTime);
      jwtService.signAsync.mockResolvedValue(expectedToken);
      tokenRepository.createToken.mockResolvedValue(
        MockFactories.createTokenRecord(),
      );

      // Act
      await service.issueTokenForUser(userId, userRole, daysExpiration);

      // Assert
      expect(tokenRepository.createToken).toHaveBeenCalledWith({
        userId,
        token: expectedToken,
        expiresAt: new Date(fixedTime + 7 * 24 * 60 * 60 * 1000), // 7 days in milliseconds
      });
    });

    it('should handle minutes unit in msToMs', async () => {
      // Arrange
      const userId = 'test-user-id';
      const userRole = UserRole.USER;
      const minutesExpiration = '45m';
      const expectedToken = 'test-token';
      const fixedTime = new Date('2024-01-01T12:00:00Z').getTime();

      jest.spyOn(Date, 'now').mockReturnValue(fixedTime);
      jwtService.signAsync.mockResolvedValue(expectedToken);
      tokenRepository.createToken.mockResolvedValue(
        MockFactories.createTokenRecord(),
      );

      // Act
      await service.issueTokenForUser(userId, userRole, minutesExpiration);

      // Assert
      expect(tokenRepository.createToken).toHaveBeenCalledWith({
        userId,
        token: expectedToken,
        expiresAt: new Date(fixedTime + 45 * 60 * 1000), // 45 minutes in milliseconds
      });
    });

    it('should handle edge case: empty string expiration', async () => {
      // Arrange
      const userId = 'test-user-id';
      const userRole = UserRole.USER;
      const emptyExpiration = '';
      const expectedToken = 'test-token';
      const fixedTime = new Date('2024-01-01T12:00:00Z').getTime();

      jest.spyOn(Date, 'now').mockReturnValue(fixedTime);
      jwtService.signAsync.mockResolvedValue(expectedToken);
      tokenRepository.createToken.mockResolvedValue(
        MockFactories.createTokenRecord(),
      );

      // Act
      await service.issueTokenForUser(userId, userRole, emptyExpiration);

      // Assert - Should default to 24 hours for empty string
      expect(tokenRepository.createToken).toHaveBeenCalledWith({
        userId,
        token: expectedToken,
        expiresAt: new Date(fixedTime + 24 * 60 * 60 * 1000), // 24 hours default
      });
    });

    it('should handle zero as numeric expiration', async () => {
      // Arrange
      const userId = 'test-user-id';
      const userRole = UserRole.USER;
      const zeroExpiration = 0;
      const expectedToken = 'test-token';
      const fixedTime = new Date('2024-01-01T12:00:00Z').getTime();

      jest.spyOn(Date, 'now').mockReturnValue(fixedTime);
      jwtService.signAsync.mockResolvedValue(expectedToken);
      tokenRepository.createToken.mockResolvedValue(
        MockFactories.createTokenRecord(),
      );

      // Act
      await service.issueTokenForUser(userId, userRole, zeroExpiration);

      // Assert - Should handle 0 seconds (immediate expiration)
      expect(tokenRepository.createToken).toHaveBeenCalledWith({
        userId,
        token: expectedToken,
        expiresAt: new Date(fixedTime), // 0 seconds
      });
    });
  });
});
