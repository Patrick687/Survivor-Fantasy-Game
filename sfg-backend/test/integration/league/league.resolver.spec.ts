import { PrismaService } from 'src/prisma/prisma.service';
import createTestApp, { TestApp } from '../utils/setup-nest-app';
import { AuthPayload, SeasonEntity, SignupDto } from 'generated/graphql';
import { SignupDataBuilder } from '../utils/builders/signup.builder';
import { AuthActions } from '../utils/actions/auth.actions';
import { LeagueDataBuilder } from '../utils/builders/league.builder';
import { LeagueActions } from '../utils/actions/league.actions';
import { UnauthorizedException } from '@nestjs/common';
import { SeasonActions } from '../utils/actions/season.actions';
import { SeasonDataBuilder } from '../utils/builders/season.builder';
import cleanUpData from '../utils/clean-up-data';

describe('LeagueResolver', () => {
  let app: TestApp;
  let prisma: PrismaService;

  let user1AuthPayload: AuthPayload;
  let season: SeasonEntity;

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
    const user1SignupDto: SignupDto = {
      email: 'user1@test.com',
      password: 'Asdf1234!',
      userName: 'user1',
      firstName: 'user1',
      lastName: 'test',
    };
    const user1Data = new SignupDataBuilder().withData(user1SignupDto).build();
    user1AuthPayload = await new AuthActions(app).expectSignupToSucceed(
      user1Data,
    );
    app.setAuthToken(user1AuthPayload.token);

    season = await new SeasonActions(app).expectCreateSeasonToSucceed(
      new SeasonDataBuilder().build(),
    );
  });

  describe('createLeague', () => {
    it('should require valid Jwt token', async () => {
      app.clearAuth();
      const leagueData = new LeagueDataBuilder()
        .withSeasonId(season.seasonId)
        .build();
      await new LeagueActions(app).expectCreateLeagueToFail(
        leagueData,
        UnauthorizedException,
      );
    });
    it('should create a league and assign the creating user as OWNER', async () => {
      const leagueData = new LeagueDataBuilder()
        .withSeasonId(season.seasonId)
        .build();
      await new LeagueActions(app).expectCreateLeagueToSucceed(leagueData);
    });
  });

  describe('getMyLeagues', () => {
    it('should require valid Jwt token', async () => {
      app.clearAuth();
      await new LeagueActions(app).expectGetMyLeaguesToFail(
        UnauthorizedException,
      );
    });

    it('should return an empty array when user has no leagues', async () => {
      const response = await new LeagueActions(app).getMyLeagues();
      new LeagueActions(app).expectGetMyLeaguesToSucceed([]);
    });

    it('should return all leagues the user is a member of - 1 league', async () => {
      const season = await new SeasonActions(app).expectCreateSeasonToSucceed(
        new SeasonDataBuilder().withSeasonId(2).build(),
      );
      const createdLeague = await new LeagueActions(
        app,
      ).expectCreateLeagueToSucceed(
        new LeagueDataBuilder().withSeasonId(season.seasonId).build(),
      );

      await new LeagueActions(app).expectGetMyLeaguesToSucceed([createdLeague]);
    });

    it('should return all leagues the user is a member of - multiple leagues', async () => {
      const season2 = await new SeasonActions(app).expectCreateSeasonToSucceed(
        new SeasonDataBuilder().withSeasonId(2).build(),
      );
      const season37 = await new SeasonActions(app).expectCreateSeasonToSucceed(
        new SeasonDataBuilder().withSeasonId(37).build(),
      );
      const createdLeague1 = await new LeagueActions(
        app,
      ).expectCreateLeagueToSucceed(
        new LeagueDataBuilder().withSeasonId(season2.seasonId).build(),
      );
      const createdLeague2 = await new LeagueActions(
        app,
      ).expectCreateLeagueToSucceed(
        new LeagueDataBuilder().withSeasonId(season2.seasonId).build(),
      );
      const createdLeague3 = await new LeagueActions(
        app,
      ).expectCreateLeagueToSucceed(
        new LeagueDataBuilder().withSeasonId(season37.seasonId).build(),
      );

      await new LeagueActions(app).expectGetMyLeaguesToSucceed([
        createdLeague1,
        createdLeague2,
        createdLeague3,
      ]);
    });
  });
});
