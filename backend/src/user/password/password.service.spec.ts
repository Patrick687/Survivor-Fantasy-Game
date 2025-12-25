import { Test } from '@nestjs/testing';
import { PasswordService } from './password.service';
import { PasswordRepository } from './password.repository';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createMock } from '@golevelup/ts-jest';

jest.mock('bcrypt');

describe('PasswordService', () => {
  let service: PasswordService;
  let repo: PasswordRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PasswordService, PasswordRepository],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(PasswordService);
    repo = module.get(PasswordRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('encryptPassword', () => {
    it('should hash the password with bcrypt', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      // @ts-ignore: testing private method
      const result = await service['encryptPassword']('plain');
      expect(bcrypt.hash).toHaveBeenCalledWith('plain', 10);
      expect(result).toBe('hashed');
    });
  });

  describe('comparePassword', () => {
    it('should compare passwords with bcrypt', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      // @ts-ignore: testing private method
      const result = await service['comparePassword']('plain', 'hashed');
      expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hashed');
      expect(result).toBe(true);
    });
  });

  describe('validatePasswordForUser', () => {
    it('should throw if password record not found', async () => {
      // Manually mock the method
      jest.spyOn(repo, 'findByUnique').mockResolvedValue(null);
      await expect(
        service.validatePasswordForUser({ userId: 'id', rawPassword: 'pw' }),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should return true if password matches', async () => {
      jest
        .spyOn(repo, 'findByUnique')
        .mockResolvedValue({ hash: 'hashed' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await service.validatePasswordForUser({
        userId: 'id',
        rawPassword: 'pw',
      });
      expect(result).toBe(true);
    });

    it('should return false if password does not match', async () => {
      jest
        .spyOn(repo, 'findByUnique')
        .mockResolvedValue({ hash: 'hashed' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const result = await service.validatePasswordForUser({
        userId: 'id',
        rawPassword: 'pw',
      });
      expect(result).toBe(false);
    });
  });

  describe('registerPasswordForUser', () => {
    it('should hash and store the password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpw');
      jest
        .spyOn(repo, 'create')
        .mockResolvedValue({ userId: 'id', hash: 'hashedpw' } as any);

      const result = await service.registerPasswordForUser({
        userId: 'id',
        rawPassword: 'pw',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('pw', 10);
      expect(repo.create).toHaveBeenCalledWith(
        {
          data: {
            userId: 'id',
            hash: 'hashedpw',
          },
        },
        undefined,
      );
      expect(result).toEqual({ userId: 'id', hash: 'hashedpw' });
    });

    it('should pass tx to repository if provided', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpw');
      const tx = {};
      jest
        .spyOn(repo, 'create')
        .mockResolvedValue({ userId: 'id', hash: 'hashedpw' } as any);

      await service.registerPasswordForUser(
        { userId: 'id', rawPassword: 'pw' },
        tx as any,
      );

      expect(repo.create).toHaveBeenCalledWith(
        {
          data: {
            userId: 'id',
            hash: 'hashedpw',
          },
        },
        tx,
      );
    });
  });
});
