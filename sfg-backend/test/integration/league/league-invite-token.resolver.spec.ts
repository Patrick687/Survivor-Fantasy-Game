import { UnauthorizedException } from '@nestjs/common';
import { AuthPayload, LeagueEntity } from '../../../generated/graphql';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { AuthActions } from '../utils/actions/auth.actions';
import { LeagueInviteCodeActions } from '../utils/actions/league-invite-code.actions';
import { LeagueActions } from '../utils/actions/league.actions';
import { SeasonActions } from '../utils/actions/season.actions';
import { LeagueDataBuilder } from '../utils/builders/league.builder';
import { SeasonDataBuilder } from '../utils/builders/season.builder';
import { SignupDataBuilder } from '../utils/builders/signup.builder';
import cleanUpData from '../utils/clean-up-data';
import createTestApp, { TestApp } from '../utils/setup-nest-app';
import { LeagueMemberRole } from '@prisma/client';

describe('League Invite Token Resolver', () => {
  let app: TestApp;
  let prisma: PrismaService;
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

  describe('joinLeagueWithToken', () => {
    let league: LeagueEntity;
    let user1: AuthPayload;
    let user2: AuthPayload;
  });

  describe('generateInviteCode', () => {
    let league: LeagueEntity;
    let user1: AuthPayload;
    let user2: AuthPayload;
    beforeEach(async () => {
      user1 = await new AuthActions(app).expectSignupToSucceed(
        new SignupDataBuilder().build(),
      );
      user2 = await new AuthActions(app).expectSignupToSucceed(
        new SignupDataBuilder()
          .withData({
            email: 'user2@test.com',
            userName: 'user2',
          })
          .build(),
      );
      app.setAuthToken(user1.token);
      const season = await new SeasonActions(app).expectCreateSeasonToSucceed(
        new SeasonDataBuilder().build(),
      );

      league = await new LeagueActions(app).expectCreateLeagueToSucceed(
        new LeagueDataBuilder().build(),
      );
    });

    it('should require token for generateInviteCode', async () => {
      app.clearAuth();
      await new LeagueInviteCodeActions(app).expectGenerateInviteCodeToFail(
        { leagueId: league.leagueId, expiresInMinutes: 30 },
        UnauthorizedException,
      );
    });

    it('should not allow non-existing league member to generateInviteCode', async () => {
      app.setAuthToken(user2.token);
      await new LeagueInviteCodeActions(app).expectGenerateInviteCodeToFail({
        leagueId: league.leagueId,
        expiresInMinutes: 30,
      });
    });
    it('should successfully allow admin to generateInviteCode', async () => {
      await prisma.leagueMember.update({
        where: {
          leagueId_userId: {
            leagueId: league.leagueId,
            userId: user1.user.userId,
          },
        },
        data: { role: LeagueMemberRole.ADMIN },
      });
      await new LeagueInviteCodeActions(app).expectGenerateInviteCodeToSucceed({
        leagueId: league.leagueId,
        expiresInMinutes: 30,
      });
    });
    it('should successfully allow owner to generateInviteCode', async () => {
      await prisma.leagueMember.update({
        where: {
          leagueId_userId: {
            leagueId: league.leagueId,
            userId: user1.user.userId,
          },
        },
        data: { role: LeagueMemberRole.OWNER },
      });
      await new LeagueInviteCodeActions(app).expectGenerateInviteCodeToSucceed({
        leagueId: league.leagueId,
        expiresInMinutes: 30,
      });
    });
    it('should allow user to create 2 invite codes', async () => {
      await new LeagueInviteCodeActions(app).expectGenerateInviteCodeToSucceed({
        leagueId: league.leagueId,
        expiresInMinutes: 30,
      });

      await new LeagueInviteCodeActions(app).expectGenerateInviteCodeToSucceed({
        leagueId: league.leagueId,
        expiresInMinutes: 30,
      });
    });
  });
});
