import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/user/password/password.service';
import { ProfileService } from 'src/user/profile/profile.service';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { MockFactories } from '../utils/mock-factories';
import { UserRole as UserRolePrisma } from '@prisma/client';
import { UserRole } from 'src/user/entities/user-role.enum';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;
  let profileService: ProfileService;
  let passwordService: PasswordService;
  let prismaService: PrismaService;

  const mockRepository = {
    findUserByUnique: jest.fn(),
    createUser: jest.fn(),
  };

  const mockProfileService = {
    getProfile: jest.fn(),
    createProfile: jest.fn(),
  };

  const mockPasswordService = {
    createPassword: jest.fn(),
    validatePassword: jest.fn(),
  };

  const mockPrismaService = {
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockRepository },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
    profileService = module.get<ProfileService>(ProfileService);
    passwordService = module.get<PasswordService>(PasswordService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should return UserDomain for a valid userId', async () => {
      // Arrange
      const userId = 'test-user-id-123';
      const mockUserRecord = {
        userId,
        email: 'test@example.com',
        role: UserRolePrisma.USER,
      };
      mockRepository.findUserByUnique.mockResolvedValue(mockUserRecord);

      // Act
      const result = await service.getUser({ userId });

      // Assert
      expect(repository.findUserByUnique).toHaveBeenCalledWith({ userId });
      expect(result).toEqual({
        userId: mockUserRecord.userId,
        email: mockUserRecord.email,
        role: UserRole.USER, // This gets mapped from Prisma enum to our enum
      });
    });

    it('should return UserDomain for a valid email', async () => {
      // Arrange
      const email = 'test@example.com';
      const mockUserRecord = {
        userId: 'test-user-id-123',
        email,
        role: UserRolePrisma.ADMIN,
      };
      mockRepository.findUserByUnique.mockResolvedValue(mockUserRecord);

      // Act
      const result = await service.getUser({ email });

      // Assert
      expect(repository.findUserByUnique).toHaveBeenCalledWith({ email });
      expect(result).toEqual({
        userId: mockUserRecord.userId,
        email: mockUserRecord.email,
        role: UserRole.ADMIN, // This gets mapped from Prisma enum to our enum
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      const userId = 'non-existent-user-id';
      mockRepository.findUserByUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getUser({ userId })).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getUser({ userId })).rejects.toThrow(
        `User where userId = '${userId}' not found.`,
      );
    });
  });

  describe('getUserByProfile', () => {
    it('should return UserDomain when profile exists', async () => {
      // Arrange
      const userName = 'testuser123';
      const mockProfile = MockFactories.createProfile();
      const mockUserRecord = {
        userId: mockProfile.userId,
        email: 'test@example.com',
        role: UserRolePrisma.USER,
      };

      mockProfileService.getProfile.mockResolvedValue(mockProfile);
      mockRepository.findUserByUnique.mockResolvedValue(mockUserRecord);

      // Act
      const result = await service.getUserByProfile({ userName });

      // Assert
      expect(profileService.getProfile).toHaveBeenCalledWith({ userName });
      expect(repository.findUserByUnique).toHaveBeenCalledWith({
        userId: mockProfile.userId,
      });
      expect(result).toEqual({
        userId: mockUserRecord.userId,
        email: mockUserRecord.email,
        role: UserRole.USER,
      });
    });

    it('should throw NotFoundException when profile does not exist', async () => {
      // Arrange
      const userName = 'nonexistentuser';
      mockProfileService.getProfile.mockRejectedValue(
        new NotFoundException(
          `Profile where userName = '${userName}' not found.`,
        ),
      );

      // Act & Assert
      await expect(service.getUserByProfile({ userName })).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getUserByProfile({ userName })).rejects.toThrow(
        `Profile where userName = '${userName}' not found.`,
      );
    });
  });

  describe('mapUserRole', () => {
    it('should map Prisma ADMIN role to UserRole.ADMIN', () => {
      // Act
      const result = (service as any).mapUserRole(UserRolePrisma.ADMIN);
      // Assert
      expect(result).toBe(UserRole.ADMIN);
    });

    it('should map Prisma USER role to UserRole.USER', () => {
      // Act
      const result = (service as any).mapUserRole(UserRolePrisma.USER);
      // Assert
      expect(result).toBe(UserRole.USER);
    });

    it('should throw InternalServerErrorException for unknown role', () => {
      expect(() => (service as any).mapUserRole('UNKNOWN_ROLE')).toThrow(
        'Unknown user role: UNKNOWN_ROLE',
      );
    });
  });

  describe('createUser', () => {
    it('should create user with PrismaService transaction', async () => {
      // Arrange
      const signupDto = MockFactories.createSignupDto();
      const mockUserRecord = MockFactories.createUserRecord({
        email: signupDto.email,
        userId: 'new-user-id-123',
      });

      // Mock the transaction to return the user record
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return await callback({
          // Mock transaction client
        });
      });

      // Mock the repository and services
      mockRepository.createUser.mockResolvedValue(mockUserRecord);
      mockProfileService.createProfile.mockResolvedValue({});
      mockPasswordService.createPassword.mockResolvedValue({});

      // Mock the final getUser call that createUser makes
      mockRepository.findUserByUnique.mockResolvedValue(mockUserRecord);

      // Act
      const createUserInput = {
        userInfo: {
          email: signupDto.email,
        },
        passwordInfo: {
          rawPassword: signupDto.password,
        },
        profileInfo: {
          firstName: signupDto.firstName,
          lastName: signupDto.lastName,
          userName: signupDto.userName,
          isPublic: false,
        },
      };
      const result = await service.createUser(createUserInput);

      // Assert
      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          userId: mockUserRecord.userId,
          email: mockUserRecord.email,
          role: UserRole.USER,
        }),
      );
    });

    it('should create user with existing transaction client', async () => {
      // Arrange
      const signupDto = MockFactories.createSignupDto();
      const mockUserRecord = MockFactories.createUserRecord({
        email: signupDto.email,
        userId: 'new-user-id-123',
      });

      const mockTransactionClient = {
        // Mock transaction client without $transaction method
      };

      // Mock the repository and services for direct transaction usage
      mockRepository.createUser.mockResolvedValue(mockUserRecord);
      mockProfileService.createProfile.mockResolvedValue({});
      mockPasswordService.createPassword.mockResolvedValue({});

      // Mock the final getUser call that createUser makes
      mockRepository.findUserByUnique.mockResolvedValue(mockUserRecord);

      // Act
      const createUserInput = {
        userInfo: {
          email: signupDto.email,
        },
        passwordInfo: {
          rawPassword: signupDto.password,
        },
        profileInfo: {
          firstName: signupDto.firstName,
          lastName: signupDto.lastName,
          userName: signupDto.userName,
          isPublic: false,
        },
      };
      const result = await service.createUser(
        createUserInput,
        mockTransactionClient as any,
      );

      // Assert
      expect(prismaService.$transaction).not.toHaveBeenCalled();
      expect(repository.createUser).toHaveBeenCalledWith(
        { email: signupDto.email },
        mockTransactionClient,
      );
      expect(profileService.createProfile).toHaveBeenCalledWith(
        {
          firstName: signupDto.firstName,
          lastName: signupDto.lastName,
          userName: signupDto.userName,
          isPublic: false,
          userId: mockUserRecord.userId,
        },
        mockTransactionClient,
      );
      expect(passwordService.createPassword).toHaveBeenCalledWith(
        {
          userId: mockUserRecord.userId,
          rawPassword: signupDto.password,
        },
        mockTransactionClient,
      );
      expect(result).toEqual(
        expect.objectContaining({
          userId: mockUserRecord.userId,
          email: mockUserRecord.email,
          role: UserRole.USER,
        }),
      );
    });

    it('should handle errors during user creation transaction', async () => {
      // Arrange
      const signupDto = MockFactories.createSignupDto();
      const createUserInput = {
        userInfo: {
          email: signupDto.email,
        },
        passwordInfo: {
          rawPassword: signupDto.password,
        },
        profileInfo: {
          firstName: signupDto.firstName,
          lastName: signupDto.lastName,
          userName: signupDto.userName,
          isPublic: false,
        },
      };

      // Mock transaction to throw an error
      mockPrismaService.$transaction.mockRejectedValue(
        new Error('Database transaction failed'),
      );

      // Act & Assert
      await expect(service.createUser(createUserInput)).rejects.toThrow(
        'Database transaction failed',
      );
      expect(prismaService.$transaction).toHaveBeenCalled();
    });

    it('should handle errors during profile creation', async () => {
      // Arrange
      const signupDto = MockFactories.createSignupDto();
      const mockUserRecord = MockFactories.createUserRecord({
        email: signupDto.email,
        userId: 'new-user-id-123',
      });

      // Mock transaction implementation
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return await callback({});
      });

      mockRepository.createUser.mockResolvedValue(mockUserRecord);
      mockProfileService.createProfile.mockRejectedValue(
        new Error('Profile creation failed'),
      );

      // Act & Assert
      const createUserInput = {
        userInfo: {
          email: signupDto.email,
        },
        passwordInfo: {
          rawPassword: signupDto.password,
        },
        profileInfo: {
          firstName: signupDto.firstName,
          lastName: signupDto.lastName,
          userName: signupDto.userName,
          isPublic: false,
        },
      };

      await expect(service.createUser(createUserInput)).rejects.toThrow(
        'Profile creation failed',
      );
    });

    it('should handle errors during password creation', async () => {
      // Arrange
      const signupDto = MockFactories.createSignupDto();
      const mockUserRecord = MockFactories.createUserRecord({
        email: signupDto.email,
        userId: 'new-user-id-123',
      });

      // Mock transaction implementation
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return await callback({});
      });

      mockRepository.createUser.mockResolvedValue(mockUserRecord);
      mockProfileService.createProfile.mockResolvedValue({});
      mockPasswordService.createPassword.mockRejectedValue(
        new Error('Password creation failed'),
      );

      // Act & Assert
      const createUserInput = {
        userInfo: {
          email: signupDto.email,
        },
        passwordInfo: {
          rawPassword: signupDto.password,
        },
        profileInfo: {
          firstName: signupDto.firstName,
          lastName: signupDto.lastName,
          userName: signupDto.userName,
          isPublic: false,
        },
      };

      await expect(service.createUser(createUserInput)).rejects.toThrow(
        'Password creation failed',
      );
    });
  });
});
