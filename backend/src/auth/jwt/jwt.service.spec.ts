import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { JwtService } from './jwt.service';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('JwtService', () => {
  let service: JwtService;
  let nestJwtService: NestJwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtService],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<JwtService>(JwtService);
    nestJwtService = module.get<NestJwtService>(NestJwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signWithExpiry', () => {
    it('should sign a token and return token with expiry', async () => {
      jest
        .spyOn(configService, 'getOrThrow')
        .mockImplementation((key: string) => {
          if (key === 'JWT_SECRET') return 'supersecret';
          if (key === 'JWT_EXPIRES_IN') return '1h';
          return '';
        });
      jest.spyOn(nestJwtService, 'signAsync').mockResolvedValue('signed-token');

      const payload = { sub: 'user123' };
      const result = await service.signWithExpiry(payload);

      expect(result.token).toBe('signed-token');
      expect(result.expiresAt).toBeInstanceOf(Date);
    });

    it('should throw if signAsync fails', async () => {
      jest
        .spyOn(configService, 'getOrThrow')
        .mockImplementation((key: string) => {
          if (key === 'JWT_SECRET') return 'supersecret';
          if (key === 'JWT_EXPIRES_IN') return '1h';
          return '';
        });
      jest
        .spyOn(nestJwtService, 'signAsync')
        .mockRejectedValue(new Error('fail'));

      await expect(service.signWithExpiry({ sub: 'user123' })).rejects.toThrow(
        'fail',
      );
    });
  });

  describe('verifyAsync', () => {
    it('should verify a token and return payload', async () => {
      jest
        .spyOn(configService, 'getOrThrow')
        .mockImplementation((key: string) => {
          if (key === 'JWT_SECRET') return 'supersecret';
          return '';
        });
      jest
        .spyOn(nestJwtService, 'verifyAsync')
        .mockResolvedValue({ sub: 'user123' });

      const result = await service.verifyAsync('signed-token');
      expect(result).toEqual({ sub: 'user123' });
    });

    it('should throw if verifyAsync fails', async () => {
      jest
        .spyOn(configService, 'getOrThrow')
        .mockImplementation((key: string) => {
          if (key === 'JWT_SECRET') return 'supersecret';
          return '';
        });
      jest
        .spyOn(nestJwtService, 'verifyAsync')
        .mockRejectedValue(new Error('invalid'));

      await expect(service.verifyAsync('bad-token')).rejects.toThrow('invalid');
    });
  });
});
