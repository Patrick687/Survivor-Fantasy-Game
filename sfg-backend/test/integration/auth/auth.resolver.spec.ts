import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import createTestApp, { TestApp } from '../utils/setup-nest-app';
import {
  expectGraphQLError,
  expectGraphQLSuccess,
} from '../utils/graphql-assertions';
import { LoginDto, SignupDto } from 'generated/graphql';
import { loginMutation, signupMutation } from '../utils/mutations';
import { UserBuilder } from '../utils/builders/user.builder';

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
    // Clean ALL related tables to avoid token collisions
    await prisma.token.deleteMany({});
    await prisma.user.deleteMany({});

    // Verify clean state
    const userCount = await prisma.user.count();
    const tokenCount = await prisma.token.count();
    expect(userCount).toBe(0);
    expect(tokenCount).toBe(0);
  });

  afterAll(async () => {
    await prisma.token.deleteMany({});
    await prisma.user.deleteMany({});
    await app.cleanup();
  });

  function expectSignupMutationToMatchInput(
    data: SignupDto,
    signupResponse: any,
  ) {
    expect(signupResponse.token).toBeDefined();
    const token = signupResponse.token;
    expect(typeof token).toBe('string');
    expect(token).not.toHaveLength(0);

    expect(signupResponse.user).toBeDefined();
    const user = signupResponse.user;
    expect(user.userId).toBeDefined();
    expect(user.email).toBe(data.email);
    expect(user.role).toBe('USER');

    expect(user.profile).toBeDefined();
    const profile = user.profile;
    expect(profile.id).toBeDefined();
    expect(profile.firstName).toBe(data.firstName);
    expect(profile.lastName).toBe(data.lastName);
    expect(profile.userName).toBe(data.userName);
    expect(profile.isPublic).toBe(true);
  }

  function expectLoginMutationToMatchInput(data: LoginDto, loginResponse: any) {
    expect(loginResponse.token).toBeDefined();
    const token = loginResponse.token;
    expect(typeof token).toBe('string');
    expect(token).not.toHaveLength(0);

    expect(loginResponse.user).toBeDefined();
    const user = loginResponse.user;
    expect(user.userId).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.role).toBe('USER');

    expect(user.profile).toBeDefined();
    const profile = user.profile;
    expect(profile.id).toBeDefined();
    expect(profile.firstName).toBeDefined();
    expect(profile.lastName).toBeDefined();
    expect(profile.userName).toBeDefined();
    expect(profile.isPublic).toBeDefined();

    expect(
      user.email === data.userNameOrEmail ||
        user.profile.userName === data.userNameOrEmail,
    ).toBe(true);
  }

  describe('signup', () => {
    it('should signup a new user', async () => {
      const signupData: SignupDto = {
        email: 'newuser@test.com',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser123',
      };

      const response = await app.mutation<'signup'>(signupMutation, {
        data: signupData,
      });

      expectGraphQLSuccess(response);
      const responseData = response.body.data.signup;
      expectSignupMutationToMatchInput(signupData, responseData);
    });

    it('should not allow duplicate email signup', async () => {
      const signupData: SignupDto = {
        email: 'duplicate@test.com', // Different email per test
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser123',
      };

      // Create first user
      await UserBuilder.build(app, signupData);

      // Try to create duplicate
      const response = await app.mutation<'signup'>(signupMutation, {
        data: {
          ...signupData,
          userName: 'anotherusername',
        },
      });

      expectGraphQLError(response, ConflictException, [
        'email',
        'already exists',
      ]);
    });

    it('should not allow duplicate username signup', async () => {
      const signupData: SignupDto = {
        email: 'username-test@test.com', // Different email per test
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        userName: 'duplicateusername',
      };

      await UserBuilder.build(app, signupData);

      const response = await app.mutation<'signup'>(signupMutation, {
        data: {
          ...signupData,
          email: 'different@test.com', // Different email, same username
        },
      });

      expectGraphQLError(response, ConflictException, [
        'userName',
        'already exists',
      ]);
    });
  });

  describe('login', () => {
    it('should login with email', async () => {
      // Create user for this specific test
      const signupData: SignupDto = {
        email: 'login-email-test@test.com', // Unique email per test
        password: 'TestPassword123!',
        firstName: 'Login',
        lastName: 'Test',
        userName: 'loginemailtest',
      };

      await UserBuilder.build(app, signupData);

      const response = await app.mutation<'login'>(loginMutation, {
        data: {
          userNameOrEmail: signupData.email,
          password: signupData.password,
        },
      });

      expectGraphQLSuccess(response);
      const responseData = response.body.data.login;
      expectLoginMutationToMatchInput(
        {
          userNameOrEmail: signupData.email,
          password: signupData.password,
        },
        responseData,
      );
    });

    it('should login with username', async () => {
      // Create user for this specific test
      const signupData: SignupDto = {
        email: 'login-username-test@test.com', // Unique email per test
        password: 'TestPassword123!',
        firstName: 'Login',
        lastName: 'Test',
        userName: 'loginusernametest',
      };

      await UserBuilder.build(app, signupData);

      const response = await app.mutation<'login'>(loginMutation, {
        data: {
          userNameOrEmail: signupData.userName,
          password: signupData.password,
        },
      });

      expectGraphQLSuccess(response);
      const responseData = response.body.data.login;
      expectLoginMutationToMatchInput(
        {
          userNameOrEmail: signupData.userName,
          password: signupData.password,
        },
        responseData,
      );
    });

    it('should fail for non-existing user via email', async () => {
      const response = await app.mutation<'login'>(loginMutation, {
        data: {
          userNameOrEmail: 'nonexistent@mail.com',
          password: 'wrongpassword',
        },
      });

      expectGraphQLError(response, UnauthorizedException, [
        'Invalid credentials',
      ]);
    });

    it('should fail for non-existing user via username', async () => {
      const response = await app.mutation<'login'>(loginMutation, {
        data: {
          userNameOrEmail: 'nonexistentusername',
          password: 'wrongpassword',
        },
      });

      expectGraphQLError(response, UnauthorizedException, [
        'Invalid credentials',
      ]);
    });
  });
});
