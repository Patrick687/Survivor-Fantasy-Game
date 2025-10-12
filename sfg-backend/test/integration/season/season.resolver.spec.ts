import { PrismaService } from 'src/prisma/prisma.service';
import createTestApp, { TestApp } from '../utils/setup-nest-app';
import { AuthPayload, CreateSeasonDto } from 'generated/graphql';
import { SeasonBuilder } from '../utils/builders/season.builder';
import { UserBuilder } from '../utils/builders/user.builder';
import { createSeasonMutation } from '../utils/mutations';
import { expectGraphQLError } from '../utils/graphql-assertions';
import { UnauthorizedException } from '@nestjs/common';

describe('SeasonResolver', () => {
  let app: TestApp;
  let prisma: PrismaService;

  let user1AuthPayload: AuthPayload;

  beforeAll(async () => {
    const {
      app: testApp,
      services: { prismaService },
    } = await createTestApp();

    app = testApp;
    prisma = prismaService;
  });

  beforeEach(async () => {
    await prisma.season.deleteMany({});
  });

  describe('createSeason', () => {
    it('should require valid Jwt token', async () => {
      const seasonInfo: CreateSeasonDto = {
        seasonId: 45,
        filmingLocation: 'Fiji',
        airStartDate: '2024-01-01',
        airEndDate: '2024-05-01',
      };

      const response = await app.mutation<'createSeason'>(
        createSeasonMutation,
        {
          input: seasonInfo,
        },
      );
      expectGraphQLError(response, UnauthorizedException);
    });

    it('should create a season', async () => {
      // Create authenticated user
      user1AuthPayload = await UserBuilder.build(app, {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser',
      });

      app.setAuthToken(user1AuthPayload.token);

      const seasonInfo: CreateSeasonDto = {
        seasonId: 45,
        filmingLocation: 'Fiji',
        airStartDate: '2024-01-01',
        airEndDate: '2024-05-01',
      };

      // Use SeasonBuilder which handles the mutation and assertions
      const createdSeason = await SeasonBuilder.build(app, seasonInfo);

      expect(createdSeason).toBeDefined();
      expect(createdSeason.seasonId).toBe(45);
      expect(createdSeason.filmingLocation).toBe('Fiji');
    });
  });
});
