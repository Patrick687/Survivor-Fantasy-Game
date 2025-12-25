import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { HealthCheckResolver } from './health-check.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

// GraphQL queries
const healthCheckQuery = `
  query Health {
    health {
      status
      timestamp
    }
  } 
`;
const servicesQuery = `
  query Health {
    health {
      status
      timestamp
      services {
        host
        name
        port
        status
      }
    }
  }
`;
const servicesOnlyQuery = `
  query Health {
    health {
      services {
        host
        name
        port
        status
      }
    }
  }
`;

// Helper to post GraphQL queries
const postGraphQL = (app: INestApplication, query: string) =>
  request(app.getHttpServer()).post('/graphql').send({ query });

describe('HealthCheck Integration Tests', () => {
  let prismaService: PrismaService;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check Query', () => {
    it('should return OK status', () =>
      postGraphQL(app, healthCheckQuery)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.health).toBeDefined();
          expect(res.body.data.health.status).toBe('OK');
          expect(res.body.data.health.timestamp).toBeDefined();
        }));

    it('should return a valid timestamp', () =>
      postGraphQL(app, healthCheckQuery)
        .expect(200)
        .expect((res) => {
          const timestamp = new Date(res.body.data.health.timestamp);
          expect(timestamp).toBeInstanceOf(Date);
          expect(timestamp.getTime()).not.toBeNaN();
        }));

    it('should NOT call services resolver if services is not requested', async () => {
      const resolver = app.get(HealthCheckResolver);
      const spy = jest.spyOn(resolver, 'services');
      await postGraphQL(app, healthCheckQuery).expect(200);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Services Field Resolution', () => {
    it('should return database connection status when healthy', () => {
      jest
        .spyOn(prismaService, '$queryRaw')
        .mockResolvedValue([{ '?column?': 1 }]);
      return postGraphQL(app, servicesQuery)
        .expect(200)
        .expect((res) => {
          const services = res.body.data.health.services;
          expect(services).toHaveLength(1);
          expect(services[0].name).toContain('Database Connection');
          expect(services[0].name).toContain('✅');
          expect(services[0].status).toBe(true);
          expect(services[0].host).toBeDefined();
          expect(services[0].port).toBeDefined();
        });
    });

    it('should return database connection status when unhealthy', () => {
      jest
        .spyOn(prismaService, '$queryRaw')
        .mockRejectedValue(new Error('Connection failed'));
      return postGraphQL(app, servicesQuery)
        .expect(200)
        .expect((res) => {
          const services = res.body.data.health.services;
          expect(services).toHaveLength(1);
          expect(services[0].name).toContain('Database Connection');
          expect(services[0].name).toContain('❌');
          expect(services[0].status).toBe(false);
        });
    });

    it('should call PrismaService.$queryRaw when checking database health', () => {
      jest
        .spyOn(prismaService, '$queryRaw')
        .mockResolvedValue([{ '?column?': 1 }]);
      return postGraphQL(app, servicesQuery)
        .expect(200)
        .then(() => {
          expect(prismaService.$queryRaw).toHaveBeenCalledTimes(1);
        });
    });
  });

  describe('Environment Variable Handling', () => {
    it('should extract host and port from DATABASE_URL', async () => {
      const originalEnv = process.env.DATABASE_URL;
      process.env.DATABASE_URL =
        'postgresql://postgres:postgres@localhost:5432/sfg_test';
      try {
        const response = await postGraphQL(app, servicesOnlyQuery).expect(200);
        const service = response.body.data.health.services[0];
        expect(service.host).toBe('localhost');
        expect(service.port).toBe(5432);
      } finally {
        process.env.DATABASE_URL = originalEnv;
      }
    });

    it('should handle missing DATABASE_URL gracefully', async () => {
      const originalEnv = process.env.DATABASE_URL;
      delete process.env.DATABASE_URL;
      try {
        await postGraphQL(app, servicesOnlyQuery)
          .expect(200)
          .expect((res) => {
            const service = res.body.data.health.services[0];
            expect(service.host).toBe('unknown');
            expect(service.port).toBe(0);
          });
      } finally {
        process.env.DATABASE_URL = originalEnv;
      }
    });
  });
});
