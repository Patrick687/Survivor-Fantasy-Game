import createTestApp, { TestApp } from '../utils/setup-nest-app';
import { SignupDataBuilder } from '../utils/builders/signup.builder';
import { AuthActions } from '../utils/actions/auth.actions';
import { ConflictException } from '@nestjs/common';
import { SignupDto } from '../../../generated/graphql';
import { PrismaService } from '../../../src/prisma/prisma.service';
import cleanUpData from '../utils/clean-up-data';

describe('AuthResolver', () => {
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

  describe('signup', () => {
    it('should signup a new user', async () => {
      const userData = new SignupDataBuilder().build();
      await new AuthActions(app).expectSignupToSucceed(userData);
    });

    it('should not allow duplicate email signup', async () => {
      const userData = new SignupDataBuilder().build();
      await new AuthActions(app).expectSignupToSucceed(userData);

      const user2Data = new SignupDataBuilder()
        .withUserName('anothername')
        .build();
      const response = await new AuthActions(app).expectSignupToFail(
        user2Data,
        ConflictException,
        ['email', 'already exists'],
      );
    });

    it('should not allow duplicate username signup', async () => {
      const userData = new SignupDataBuilder().build();
      await new AuthActions(app).expectSignupToSucceed(userData);

      const user2Data = new SignupDataBuilder()
        .withEmail('anotheremail@test.com')
        .build();
      const response = await new AuthActions(app).expectSignupToFail(
        user2Data,
        ConflictException,
        ['username', 'already exists'],
      );
    });
  });

  describe('login', () => {
    let userData: SignupDto;
    it('should login with email', async () => {});

    it('should login with username', async () => {});

    it('should fail for non-existing user via email', async () => {});

    it('should fail for non-existing user via username', async () => {});

    it('should fail for wrong password', async () => {});
  });
});
