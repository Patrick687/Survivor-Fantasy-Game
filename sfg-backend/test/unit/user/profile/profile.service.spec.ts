import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProfileService } from 'src/user/profile/profile.service';
import { ProfileRepository } from 'src/user/profile/profile.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { MockFactories } from '../../utils/mock-factories';

describe('ProfileService', () => {
  let service: ProfileService;
  let repository: ProfileRepository;
  let prismaService: PrismaService;

  const mockRepository = {
    findProfileByUnique: jest.fn(),
    createProfile: jest.fn(),
  };

  const mockPrismaService = {
    // Add any PrismaService methods that might be used
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: ProfileRepository, useValue: mockRepository },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    repository = module.get<ProfileRepository>(ProfileRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return profile for valid userId', async () => {
      // Arrange
      const userId = 'test-user-id-123';
      const mockProfile = MockFactories.createProfile({ userId });
      mockRepository.findProfileByUnique.mockResolvedValue(mockProfile);

      // Act
      const result = await service.getProfile({ userId });

      // Assert
      expect(repository.findProfileByUnique).toHaveBeenCalledWith({ userId });
      expect(result).toEqual(mockProfile);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      // Arrange
      const userId = 'non-existent-user-id';
      mockRepository.findProfileByUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getProfile({ userId })).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getProfile({ userId })).rejects.toThrow(
        `Profile where userId = '${userId}' not found.`,
      );
    });
  });

  describe('createProfile', () => {
    it('should create and return new profile', async () => {
      // Arrange
      const profileData = {
        userId: 'test-user-id-123',
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser123',
      };
      const mockProfile = MockFactories.createProfile(profileData);
      mockRepository.createProfile.mockResolvedValue(mockProfile);

      // Act
      const result = await service.createProfile(profileData);

      // Assert
      expect(repository.createProfile).toHaveBeenCalledWith(
        profileData,
        prismaService,
      );
      expect(result).toEqual(mockProfile);
    });
  });
});
