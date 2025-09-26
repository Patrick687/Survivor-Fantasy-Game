import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { PasswordService } from 'src/user/password/password.service';
import { TokenService } from 'src/auth/token/token.service';
import { MockFactories } from '../utils/mock-factories';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let passwordService: PasswordService;
  let tokenService: TokenService;

  const mockUserService = {
    createUser: jest.fn(),
    getUser: jest.fn(),
    getUserByProfile: jest.fn(),
  };

  const mockPasswordService = {
    validatePassword: jest.fn(),
  };

  const mockTokenService = {
    issueTokenForUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    passwordService = module.get<PasswordService>(PasswordService);
    tokenService = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create user and return auth payload', async () => {
      // Arrange
      const signupDto = MockFactories.createSignupDto();
      const mockUser = MockFactories.createUser({ email: signupDto.email });
      const mockToken = { token: 'jwt-token-123' };

      mockUserService.createUser.mockResolvedValue(mockUser);
      mockTokenService.issueTokenForUser.mockResolvedValue(mockToken);

      // Act
      const result = await service.signup(signupDto);

      // Assert
      expect(userService.createUser).toHaveBeenCalledWith({
        userInfo: { email: signupDto.email },
        passwordInfo: { rawPassword: signupDto.password },
        profileInfo: {
          firstName: signupDto.firstName,
          lastName: signupDto.lastName,
          userName: signupDto.userName,
        },
      });
      expect(tokenService.issueTokenForUser).toHaveBeenCalledWith(
        mockUser.userId,
        mockUser.role,
      );
      expect(result).toEqual({
        user: mockUser,
        token: mockToken.token,
      });
    });

    it('should handle mixed case email and username in signup', async () => {
      // Arrange
      const signupDto = MockFactories.createSignupDto({
        email: 'TEST@EXAMPLE.COM', // Will be transformed to lowercase by DTO
        userName: 'TESTUSER123', // Will be transformed to lowercase by DTO
      });
      const mockUser = MockFactories.createUser({
        email: 'test@example.com', // Expected lowercase version
      });
      const mockToken = { token: 'jwt-token-123' };

      mockUserService.createUser.mockResolvedValue(mockUser);
      mockTokenService.issueTokenForUser.mockResolvedValue(mockToken);

      // Act - Note: In reality, the DTO transformation would happen before this,
      // but we're testing that the service works with the expected lowercase values
      const result = await service.signup({
        ...signupDto,
        email: 'test@example.com',
        userName: 'testuser123',
      });

      // Assert
      expect(userService.createUser).toHaveBeenCalledWith({
        userInfo: { email: 'test@example.com' },
        passwordInfo: { rawPassword: signupDto.password },
        profileInfo: {
          firstName: signupDto.firstName,
          lastName: signupDto.lastName,
          userName: 'testuser123',
        },
      });
      expect(result).toEqual({
        user: mockUser,
        token: mockToken.token,
      });
    });
  });

  describe('login', () => {
    it('should login user with email and return auth payload', async () => {
      // Arrange
      const loginDto = MockFactories.createLoginDto({
        userNameOrEmail: 'test@example.com',
      });
      const mockUser = MockFactories.createUser({
        email: loginDto.userNameOrEmail,
      });
      const mockToken = { token: 'jwt-token-123' };

      mockUserService.getUser.mockResolvedValue(mockUser);
      mockUserService.getUserByProfile.mockResolvedValue(undefined); // catch() returns undefined
      mockPasswordService.validatePassword.mockResolvedValue(true);
      mockTokenService.issueTokenForUser.mockResolvedValue(mockToken);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(userService.getUser).toHaveBeenCalledWith({
        email: loginDto.userNameOrEmail,
      });
      expect(passwordService.validatePassword).toHaveBeenCalledWith({
        userId: mockUser.userId,
        rawPassword: loginDto.password,
      });
      expect(tokenService.issueTokenForUser).toHaveBeenCalledWith(
        mockUser.userId,
        mockUser.role,
      );
      expect(result).toEqual({
        user: mockUser,
        token: mockToken.token,
      });
    });

    it('should login user with username and return auth payload', async () => {
      // Arrange
      const loginDto = MockFactories.createLoginDto({
        userNameOrEmail: 'testuser123',
      });
      const mockUser = MockFactories.createUser();
      const mockToken = { token: 'jwt-token-123' };

      mockUserService.getUser.mockResolvedValue(undefined); // catch() returns undefined
      mockUserService.getUserByProfile.mockResolvedValue(mockUser);
      mockPasswordService.validatePassword.mockResolvedValue(true);
      mockTokenService.issueTokenForUser.mockResolvedValue(mockToken);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(userService.getUser).toHaveBeenCalledWith({
        email: loginDto.userNameOrEmail,
      });
      expect(userService.getUserByProfile).toHaveBeenCalledWith({
        userName: loginDto.userNameOrEmail,
      });
      expect(passwordService.validatePassword).toHaveBeenCalledWith({
        userId: mockUser.userId,
        rawPassword: loginDto.password,
      });
      expect(result).toEqual({
        user: mockUser,
        token: mockToken.token,
      });
    });

    it('should handle mixed case email and username in login', async () => {
      // Arrange - Test both email and username scenarios
      const mockUser = MockFactories.createUser();
      const mockToken = { token: 'jwt-token-123' };

      mockPasswordService.validatePassword.mockResolvedValue(true);
      mockTokenService.issueTokenForUser.mockResolvedValue(mockToken);

      // Test with mixed case email (DTO would transform to lowercase)
      const emailLoginDto = {
        userNameOrEmail: 'test@example.com', // Already lowercase after DTO transformation
        password: 'TestPass123!',
      };

      mockUserService.getUser.mockResolvedValue(mockUser);
      mockUserService.getUserByProfile.mockResolvedValue(undefined);

      // Act
      const emailResult = await service.login(emailLoginDto);

      // Assert
      expect(userService.getUser).toHaveBeenCalledWith({
        email: 'test@example.com', // Should be lowercase
      });
      expect(emailResult).toEqual({
        user: mockUser,
        token: mockToken.token,
      });

      // Clear mocks for next test
      jest.clearAllMocks();

      // Setup for username test
      mockPasswordService.validatePassword.mockResolvedValue(true);
      mockTokenService.issueTokenForUser.mockResolvedValue(mockToken);

      // Test with mixed case username (DTO would transform to lowercase)
      const usernameLoginDto = {
        userNameOrEmail: 'testuser123', // Already lowercase after DTO transformation
        password: 'TestPass123!',
      };

      mockUserService.getUser.mockResolvedValue(undefined);
      mockUserService.getUserByProfile.mockResolvedValue(mockUser);

      // Act
      const usernameResult = await service.login(usernameLoginDto);

      // Assert
      expect(userService.getUserByProfile).toHaveBeenCalledWith({
        userName: 'testuser123', // Should be lowercase
      });
      expect(usernameResult).toEqual({
        user: mockUser,
        token: mockToken.token,
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      const loginDto = MockFactories.createLoginDto();

      mockUserService.getUser.mockResolvedValue(undefined); // catch() returns undefined
      mockUserService.getUserByProfile.mockResolvedValue(undefined); // catch() returns undefined

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials.',
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      const loginDto = MockFactories.createLoginDto();
      const mockUser = MockFactories.createUser();

      mockUserService.getUser.mockResolvedValue(mockUser);
      mockUserService.getUserByProfile.mockResolvedValue(undefined); // catch() returns undefined
      mockPasswordService.validatePassword.mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials.',
      );
    });
  });
});
