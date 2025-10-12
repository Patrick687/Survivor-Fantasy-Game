import { PrismaService } from 'src/prisma/prisma.service';
import createTestApp, { TestApp } from '../utils/setup-nest-app';
import { UserBuilder } from '../utils/builders/user.builder';
import { AuthPayload, SignupDto } from 'generated/graphql';

describe('LeagueResolver', () => {
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

    const user1SignupDto: SignupDto = {
      email: 'user1@test.com',
      password: 'Asdf1234!',
      userName: 'user1',
      firstName: 'user1',
      lastName: 'test',
    };
    user1AuthPayload = await UserBuilder.build(app, user1SignupDto);
  });

  describe('createLeague', async () => {
    it('should require valid Jwt token', async () => {});
    it('should create a league and assign the creating user as OWNER', async () => {});
  });

  describe('getMyLeagues', () => {
    it('should require valid Jwt token', async () => {});
    it('should return an empty array when user has no leagues', async () => {});
  });
});
