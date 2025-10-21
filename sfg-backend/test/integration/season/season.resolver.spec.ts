import { PrismaService } from 'src/prisma/prisma.service';
import createTestApp, { TestApp } from '../utils/setup-nest-app';
import { AuthPayload, CreateSeasonDto } from 'generated/graphql';
import { createSeasonMutation } from '../utils/mutations';
import { expectGraphQLError } from '../utils/graphql-assertions';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { SeasonDataBuilder } from '../utils/builders/season.builder';
import { SeasonActions } from '../utils/actions/season.actions';
import { AuthActions } from '../utils/actions/auth.actions';
import { SignupDataBuilder } from '../utils/builders/signup.builder';
import cleanUpData from '../utils/clean-up-data';

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
    await cleanUpData(prisma);
  });
  afterEach(async () => {
    await cleanUpData(prisma);
  });

  describe('createSeason', () => {
    it('should require valid Jwt token', async () => {
      const seasonData = new SeasonDataBuilder().withSeasonId(1).build();
      await new SeasonActions(app).expectCreateSeasonToFail(
        seasonData,
        UnauthorizedException,
      );
    });

    it('should create a season', async () => {
      const user1Data = new SignupDataBuilder().build();
      const user1AuthPayload = await new AuthActions(app).expectSignupToSucceed(
        user1Data,
      );
      app.setAuthToken(user1AuthPayload.token);
      const seasonData = new SeasonDataBuilder().withSeasonId(1).build();
      await new SeasonActions(app).expectCreateSeasonToSucceed(seasonData);
    });

    it('should not allow duplicate seasonId', async () => {
      const user1Data = new SignupDataBuilder().build();
      const user1AuthPayload = await new AuthActions(app).expectSignupToSucceed(
        user1Data,
      );
      app.setAuthToken(user1AuthPayload.token);
      const seasonData = new SeasonDataBuilder().withSeasonId(1).build();
      await new SeasonActions(app).expectCreateSeasonToSucceed(seasonData);

      await new SeasonActions(app).expectCreateSeasonToFail(
        seasonData,
        ConflictException,
      );
    });
  });
});
