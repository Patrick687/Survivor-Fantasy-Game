import { INestApplication } from '@nestjs/common';
import { HealthCheckResolver } from './health-check.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import initApp from 'src/test/integration/utils/initApp';
import sendGraphQLRequest from 'src/test/integration/utils/sendGraphqlRequest';

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

describe('HealthCheck Integration Tests', () => {
  let prismaService: PrismaService;
  let app: INestApplication;

  beforeAll(async () => {
    ({ app, prisma: prismaService } = await initApp());
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check Query', () => {
    it('should return OK status', () =>
      sendGraphQLRequest(app, healthCheckQuery)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.health).toBeDefined();
          expect(res.body.data.health.status).toBe('OK');
          expect(res.body.data.health.timestamp).toBeDefined();
        }));

    it('should return a valid timestamp', () =>
      sendGraphQLRequest(app, healthCheckQuery)
        .expect(200)
        .expect((res) => {
          const timestamp = new Date(res.body.data.health.timestamp);
          expect(timestamp).toBeInstanceOf(Date);
          expect(timestamp.getTime()).not.toBeNaN();
        }));

    it('should NOT call services resolver if services is not requested', async () => {
      const resolver = app.get(HealthCheckResolver);
      const spy = jest.spyOn(resolver, 'services');
      await sendGraphQLRequest(app, healthCheckQuery).expect(200);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Services Field Resolution', () => {
    it('should return database connection status when healthy', () => {
      jest
        .spyOn(prismaService, '$queryRaw')
        .mockResolvedValue([{ '?column?': 1 }]);
      return sendGraphQLRequest(app, servicesQuery)
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
      return sendGraphQLRequest(app, servicesQuery)
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
      return sendGraphQLRequest(app, servicesQuery)
        .expect(200)
        .then(() => {
          expect(prismaService.$queryRaw).toHaveBeenCalledTimes(1);
        });
    });
  });
});
