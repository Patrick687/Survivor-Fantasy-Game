import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { setupTestApp, teardownTestApp } from '../utils/common/test-app.utils';
import {
  runSignupMutation,
  cleanupTestUser,
  createUniqueSignupData,
  createLoginData,
  runLoginMutation,
} from '../utils/auth';
import { create } from 'domain';

describe('AuthResolver (Integration)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const setup = await setupTestApp();
    app = setup.app;
    prismaService = setup.prismaService;
  });

  afterAll(async () => {
    await teardownTestApp(app, prismaService);
  });

  describe('signup', () => {
    it('should return complete auth payload with all nested elements', async () => {
      const signupData = createUniqueSignupData('complete');

      const response = await runSignupMutation(
        app,
        { prismaService, cleanupInitial: true },
        signupData,
      );

      expect(response.body.errors).toBeUndefined();

      const authPayload = response.body.data.signup;

      expect(authPayload).toEqual({
        user: {
          userId: expect.any(String),
          email: signupData.email.toLowerCase(),
          role: 'USER',
          profile: {
            id: expect.any(String),
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            userName: signupData.userName.toLowerCase(),
            isPublic: true,
          },
        },
        token: expect.any(String),
      });

      expect(authPayload.user.userId).toBeDefined();
      expect(authPayload.user.profile.id).toBeDefined();
      expect(authPayload.token).toBeDefined();

      await cleanupTestUser(prismaService, signupData.email);
    });

    it('should successfully create user and save to database', async () => {
      const signupData = createUniqueSignupData('signup');

      const response = await runSignupMutation(
        app,
        { prismaService },
        signupData,
      );

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.signup.user.email).toBe(
        signupData.email.toLowerCase(),
      );
      expect(response.body.data.signup.token).toBeDefined();

      const dbUser = await prismaService.user.findUnique({
        where: { email: signupData.email.toLowerCase() },
        include: { profile: true },
      });

      expect(dbUser).toBeDefined();
      expect(dbUser!.profile).toBeDefined();
      expect(dbUser!.email).toBe(signupData.email.toLowerCase());
      expect(dbUser!.profile!.userName).toBe(signupData.userName.toLowerCase());

      await cleanupTestUser(prismaService, signupData.email);
    });

    it('should fail when email already exists', async () => {
      const signupData = createUniqueSignupData('original');

      await runSignupMutation(app, { prismaService }, signupData);

      const duplicateEmailSignupData = {
        ...createUniqueSignupData('duplicate'),
        email: signupData.email,
      };

      const duplicateResponse = await runSignupMutation(
        app,
        { prismaService, cleanupAfter: false, cleanupInitial: false },
        duplicateEmailSignupData,
      );

      expect(duplicateResponse.body.errors).toBeDefined();
      expect(duplicateResponse.body.errors).toHaveLength(1);

      const error = duplicateResponse.body.errors[0];
      expect(error.message).toContain('already exists');
      expect(duplicateResponse.body.data).toBeNull();

      await cleanupTestUser(prismaService, signupData.email);
    });

    it('should fail when username already exists', async () => {
      const firstUser = createUniqueSignupData('first');
      const secondUser = createUniqueSignupData('second');
      secondUser.userName = firstUser.userName;

      await runSignupMutation(
        app,
        { prismaService, cleanupInitial: true, cleanupAfter: false },
        firstUser,
      );

      const response = await runSignupMutation(
        app,
        { prismaService },
        secondUser,
      );

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain('username');
      expect(response.body.errors[0].message).toContain('already exists');
      expect(response.body.data).toBeNull();

      await cleanupTestUser(prismaService, firstUser.email);
    });
  });

  describe('login', () => {
    it('should login existing user with email and return auth payload', async () => {
      // Create a user first
      const signupData = createUniqueSignupData('loginByEmail');

      await runSignupMutation(
        app,
        { prismaService, cleanupInitial: true },
        signupData,
      );

      // Login with email
      const loginData = createLoginData(signupData.email, signupData.password);

      const response = await runLoginMutation(app, loginData);

      expect(response.body.errors).toBeUndefined();

      const authPayload = response.body.data.login;

      expect(authPayload).toEqual({
        user: {
          userId: expect.any(String),
          email: signupData.email.toLowerCase(),
          role: 'USER',
          profile: {
            id: expect.any(String),
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            userName: signupData.userName.toLowerCase(),
            isPublic: true,
          },
        },
        token: expect.any(String),
      });

      expect(authPayload.user.userId).toBeDefined();
      expect(authPayload.user.profile.id).toBeDefined();
      expect(authPayload.token).toBeDefined();

      await cleanupTestUser(prismaService, signupData.email);
    });

    it('should login existing user with username and return auth payload', async () => {
      // Create a user first
      const signupData = createUniqueSignupData('loginByUsername');

      await runSignupMutation(
        app,
        { prismaService, cleanupInitial: true },
        signupData,
      );

      // Login with username
      const loginData = createLoginData(
        signupData.userName,
        signupData.password,
      );

      const response = await runLoginMutation(app, loginData);

      expect(response.body.errors).toBeUndefined();

      const authPayload = response.body.data.login;

      expect(authPayload).toEqual({
        user: {
          userId: expect.any(String),
          email: signupData.email.toLowerCase(),
          role: 'USER',
          profile: {
            id: expect.any(String),
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            userName: signupData.userName.toLowerCase(),
            isPublic: true,
          },
        },
        token: expect.any(String),
      });

      expect(authPayload.user.userId).toBeDefined();
      expect(authPayload.user.profile.id).toBeDefined();
      expect(authPayload.token).toBeDefined();

      await cleanupTestUser(prismaService, signupData.email);
    });

    it('should fail login with incorrect password', async () => {
      // Create a user first
      const signupData = createUniqueSignupData('wrongPassword');

      await runSignupMutation(
        app,
        { prismaService, cleanupInitial: true },
        signupData,
      );

      // Login with wrong password
      const loginData = createLoginData(signupData.email, 'WrongPassword123!');

      const response = await runLoginMutation(app, loginData);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);

      const error = response.body.errors[0];
      expect(error.message).toContain('Invalid credentials');
      expect(error.extensions.code).toBe('INTERNAL_SERVER_ERROR');
      expect(error.extensions.status).toBe(401);
      expect(error.extensions.originalError.error).toBe('Unauthorized');
      expect(error.extensions.originalError.statusCode).toBe(401);

      expect(response.body.data).toBeNull();

      await cleanupTestUser(prismaService, signupData.email);
    });

    it('should fail login for non-existent username', async () => {
      const loginData = createLoginData(
        'nonexistentuser123',
        'SomePassword123!',
      );

      const response = await runLoginMutation(app, loginData);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);

      const error = response.body.errors[0];
      expect(error.message).toContain('Invalid credentials');
      expect(error.extensions.code).toBe('INTERNAL_SERVER_ERROR');
      expect(error.extensions.status).toBe(401);
      expect(error.extensions.originalError.error).toBe('Unauthorized');
      expect(error.extensions.originalError.statusCode).toBe(401);

      expect(response.body.data).toBeNull();
    });

    it('should fail login for non-existent email', async () => {
      const loginData = createLoginData(
        'nonexistent@test.com',
        'SomePassword123!',
      );

      const response = await runLoginMutation(app, loginData);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);

      const error = response.body.errors[0];
      expect(error.message).toContain('Invalid credentials');
      expect(error.extensions.code).toBe('INTERNAL_SERVER_ERROR');
      expect(error.extensions.status).toBe(401);
      expect(error.extensions.originalError.error).toBe('Unauthorized');
      expect(error.extensions.originalError.statusCode).toBe(401);

      expect(response.body.data).toBeNull();
    });
  });
});
