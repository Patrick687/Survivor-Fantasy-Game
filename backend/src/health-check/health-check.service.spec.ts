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
    it('should return healthy status when DB is reachable', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/dbname';
      jest.spyOn(prismaService, '$queryRaw').mockResolvedValueOnce([1]);

      jest
        .spyOn(service as any, 'extractHostAndPort')
        .mockReturnValue({ host: 'random-test-ip', port: 6969 });

      const result = await service.getHealthStatus();

      expect(result).toEqual([
        {
          name: 'Database Connection ✅',
          host: 'random-test-ip',
          port: 6969,
          status: true,
        },
      ]);
    });
  });
});
