import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from './password/password.service';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let prismaService: jest.Mocked<PrismaService>;
  let passwordService: jest.Mocked<PasswordService>;

  const userEntity = {
    id: 'uuid',
    userName: 'test',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    isPrivate: false,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: createMock<UserRepository>() },
        { provide: PrismaService, useValue: createMock<PrismaService>() },
        { provide: PasswordService, useValue: createMock<PasswordService>() },
      ],
    }).compile();

    service = moduleRef.get(UserService);
    userRepository = moduleRef.get(UserRepository);
    prismaService = moduleRef.get(PrismaService);
    passwordService = moduleRef.get(PasswordService);

    (User as any).mapToEntity = jest
      .fn()
      .mockImplementation((u) => ({ ...u, mapped: true }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return mapped user if found', async () => {
      userRepository.findByUnique.mockResolvedValue(userEntity);
      const result = await service.getUser({ id: 'uuid' });
      expect(result).toEqual({ ...userEntity, mapped: true });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findByUnique.mockResolvedValue(null);
      await expect(service.getUser({ id: 'uuid' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('should create user and return mapped user', async () => {
      jest
        .spyOn<any, any>(service as any, 'validateSignup')
        .mockResolvedValue(undefined);
      // Mock $transaction to call the callback with a tx object
      const tx = {
        $executeRaw: jest.fn(),
        $executeRawUnsafe: jest.fn(),
        $queryRaw: jest.fn(),
        $queryRawUnsafe: jest.fn(),
      };
      prismaService.$transaction.mockImplementation(async (cb) =>
        cb(tx as any),
      );
      userRepository.create.mockResolvedValue(userEntity);
      passwordService.registerPasswordForUser.mockResolvedValue({
        id: 'pw-id',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        hash: 'hashed',
        userId: userEntity.id,
      });

      const result = await service.createUser(userEntity as any, {
        password: 'Password123!',
      });
      expect(result).toEqual({ ...userEntity, mapped: true });
    });

    it('should throw ConflictException if email is not available', async () => {
      jest
        .spyOn<any, any>(service as any, 'isEmailAvailable')
        .mockResolvedValue(false);
      jest
        .spyOn<any, any>(service as any, 'isUserNameAvailable')
        .mockResolvedValue(true);
      await expect(service['validateSignup'](userEntity)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if username is not available', async () => {
      jest
        .spyOn<any, any>(service as any, 'isEmailAvailable')
        .mockResolvedValue(true);
      jest
        .spyOn<any, any>(service as any, 'isUserNameAvailable')
        .mockResolvedValue(false);
      await expect(service['validateSignup'](userEntity)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('validateUserCredentials', () => {
    it('should return mapped user if credentials are valid', async () => {
      userRepository.findByUsernameOrEmail.mockResolvedValue(userEntity);
      passwordService.validatePasswordForUser.mockResolvedValue(true);

      const result = await service.validateUserCredentials(
        'test',
        'Password123!',
      );
      expect(result).toEqual({ ...userEntity, mapped: true });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userRepository.findByUsernameOrEmail.mockResolvedValue(null);
      await expect(
        service.validateUserCredentials('test', 'Password123!'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      userRepository.findByUsernameOrEmail.mockResolvedValue(userEntity);
      passwordService.validatePasswordForUser.mockResolvedValue(false);
      await expect(
        service.validateUserCredentials('test', 'Password123!'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('isUserNameAvailable', () => {
    it('should return true if username is available', async () => {
      userRepository.findByUnique.mockResolvedValue(null);
      const result = await (service as any).isUserNameAvailable('test');
      expect(result).toBe(true);
    });

    it('should return false if username is taken', async () => {
      userRepository.findByUnique.mockResolvedValue(userEntity);
      const result = await (service as any).isUserNameAvailable('test');
      expect(result).toBe(false);
    });
  });

  describe('isEmailAvailable', () => {
    it('should return true if email is available', async () => {
      userRepository.findByUnique.mockResolvedValue(null);
      const result = await (service as any).isEmailAvailable(
        'test@example.com',
      );
      expect(result).toBe(true);
    });

    it('should return false if email is taken', async () => {
      userRepository.findByUnique.mockResolvedValue(userEntity);
      const result = await (service as any).isEmailAvailable(
        'test@example.com',
      );
      expect(result).toBe(false);
    });
  });

  // Additional edge cases for coverage
  describe('validateSignup', () => {
    it('should resolve if both email and username are available', async () => {
      jest
        .spyOn<any, any>(service as any, 'isEmailAvailable')
        .mockResolvedValue(true);
      jest
        .spyOn<any, any>(service as any, 'isUserNameAvailable')
        .mockResolvedValue(true);
      await expect(
        service['validateSignup'](userEntity),
      ).resolves.toBeUndefined();
    });
  });

  describe('private $transaction logic', () => {
    it('should pass tx object to repository and password service', async () => {
      jest
        .spyOn<any, any>(service as any, 'validateSignup')
        .mockResolvedValue(undefined);
      const tx = {
        $executeRaw: jest.fn(),
        $executeRawUnsafe: jest.fn(),
        $queryRaw: jest.fn(),
        $queryRawUnsafe: jest.fn(),
      };
      prismaService.$transaction.mockImplementation(async (cb) =>
        cb(tx as any),
      );
      userRepository.create.mockResolvedValue(userEntity);
      passwordService.registerPasswordForUser.mockResolvedValue({
        id: 'pw-id',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        hash: 'hashed',
        userId: userEntity.id,
      });

      await service.createUser(userEntity as any, { password: 'Password123!' });
      expect(userRepository.create).toHaveBeenCalledWith(
        { data: userEntity },
        tx,
      );
      expect(passwordService.registerPasswordForUser).toHaveBeenCalledWith(
        { rawPassword: 'Password123!', userId: userEntity.id },
        tx,
      );
    });
  });
});
