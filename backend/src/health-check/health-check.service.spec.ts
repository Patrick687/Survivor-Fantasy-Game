import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { HealthCheckService } from './health-check.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthCheckService', () => {
  let service: HealthCheckService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthCheckService],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<HealthCheckService>(HealthCheckService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHealthStatus', () => {
    const originalEnv = process.env.DATABASE_URL;

    beforeEach(() => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
    });

    afterEach(() => {
      process.env.DATABASE_URL = originalEnv;
    });

    it('should return healthy status when database connection succeeds', async () => {
      jest
        .spyOn(prismaService, '$queryRaw')
        .mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.getHealthStatus();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: expect.stringContaining('Database Connection ✅'),
        host: 'localhost',
        port: 5432,
        status: true,
      });
      expect(prismaService.$queryRaw).toHaveBeenCalledTimes(1);
    });

    it('should return unhealthy status when database connection fails', async () => {
      jest.spyOn(prismaService, '$queryRaw').mockRejectedValue(new Error());

      const result = await service.getHealthStatus();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: expect.stringContaining('Database Connection ❌'),
        host: 'localhost',
        port: 5432,
        status: false,
      });
    });

    it('should extract host and port from DATABASE_URL correctly', async () => {
      process.env.DATABASE_URL =
        'postgresql://admin:secret@db.example.com:3306/prod';
      jest
        .spyOn(prismaService, '$queryRaw')
        .mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.getHealthStatus();

      expect(result[0].host).toBe('db.example.com');
      expect(result[0].port).toBe(3306);
    });

    it('should handle malformed DATABASE_URL gracefully', async () => {
      process.env.DATABASE_URL = 'not-a-valid-url';
      jest
        .spyOn(prismaService, '$queryRaw')
        .mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.getHealthStatus();

      expect(result[0].host).toBe('unknown');
      expect(result[0].port).toBe(0);
    });

    it('should handle missing DATABASE_URL', async () => {
      delete process.env.DATABASE_URL;
      jest
        .spyOn(prismaService, '$queryRaw')
        .mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.getHealthStatus();

      expect(result[0].host).toBe('unknown');
      expect(result[0].port).toBe(0);
    });

    it('should not throw when database query fails', async () => {
      jest
        .spyOn(prismaService, '$queryRaw')
        .mockRejectedValue(new Error('Fatal error'));

      await expect(service.getHealthStatus()).resolves.not.toThrow();
    });
  });
});
