import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { clearDatabase, seedTestUser } from '../utils/prisma.integration.utils';

describe('AuthResolver (Integration)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Add global validation pipe with transformation enabled
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true, // This enables class-transformer
        // Remove whitelist and forbidNonWhitelisted to allow optional fields
      }),
    );

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  beforeEach(async () => {
    await clearDatabase(prismaService);
  });

  afterAll(async () => {
    await clearDatabase(prismaService);
    await app.close();
  });

  describe('signup mutation', () => {
    it('should successfully signup a new user with complete profile', async () => {
      const signupMutation = `
        mutation Signup($data: SignupDto!) {
          signup(data: $data) {
            user {
              userId
              email
              role
              profile {
                id
                firstName
                lastName
                userName
                isPublic
              }
            }
            token
          }
        }
      `;

      const signupInput = {
        email: 'NEWUSER@EXAMPLE.COM', // Test case transformation
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User', // Optional field - should be allowed
        userName: 'TESTUSER123', // Test case transformation
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: signupMutation,
          variables: { data: signupInput },
        })
        .expect(200);

      // Assert response structure
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.signup).toBeDefined();

      const { user, token } = response.body.data.signup;

      // Validate user data
      expect(user).toMatchObject({
        userId: expect.any(String),
        email: 'newuser@example.com', // Should be lowercase after transformation0000000000
        role: 'USER',
      });

      // Validate profile data
      expect(user.profile).toMatchObject({
        id: expect.any(String),
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser123', // Should be lowercase
        isPublic: true,
      });

      // Validate token
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);

      // Verify user was created in database with correct data
      const createdUser = await prismaService.user.findUnique({
        where: { email: 'newuser@example.com' },
        include: { profile: true },
      });

      if (!createdUser) {
        fail('User was not in the database');
      }

      expect(createdUser).toBeDefined();
      expect(createdUser.email).toBe('newuser@example.com');
      expect(createdUser.role).toBe('USER');

      // Verify profile was created correctly
      expect(createdUser.profile).toMatchObject({
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser123', // Should be lowercase in DB
        isPublic: true,
      });

      // Verify password was hashed (not stored as plain text)
      const passwordRecord = await prismaService.password.findFirst({
        where: { userId: createdUser.userId },
      });

      if (!passwordRecord) {
        fail('Password record was not in the database');
      }

      expect(passwordRecord).toBeDefined();
      await bcrypt
        .compare('TestPassword123!', passwordRecord.hash)
        .then((isMatch) => {
          expect(isMatch).toBe(true);
        });
      expect(passwordRecord?.hash).not.toBe('TestPassword123!');

      // Verify token was stored in database
      const tokenRecord = await prismaService.token.findFirst({
        where: { userId: createdUser.userId },
        orderBy: { createdAt: 'desc' },
      });

      if (!tokenRecord) {
        fail('Token record was not in the database');
      }

      expect(tokenRecord).toBeDefined();
      expect(tokenRecord.token).toBe(token);
    });

    it('should fail to signup user if email already exists', async () => {
      // Arrange - Create a user first
      const existingUserData = {
        email: 'existing@example.com',
        password: 'TestPassword123!',
        firstName: 'Existing',
        lastName: 'User',
        userName: 'existinguser',
      };

      await seedTestUser(prismaService, existingUserData);

      const signupMutation = `
    mutation Signup($data: SignupDto!) {
      signup(data: $data) {
        user {
          userId
          email
          role
        }
        token
      }
    }
  `;

      const signupInput = {
        email: 'EXISTING@EXAMPLE.COM', // Same email, different case
        password: 'AnotherPassword123!',
        firstName: 'Another',
        lastName: 'User',
        userName: 'anotheruser',
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: signupMutation,
          variables: { data: signupInput },
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toMatchObject({
        message: expect.stringContaining(
          'Unique constraint failed on the fields: (`email`)',
        ),
        extensions: {
          code: expect.any(String),
        },
      });
      expect(response.body.data).toBeNull();

      // Verify no additional user was created
      const userCount = await prismaService.user.count({
        where: { email: 'existing@example.com' },
      });
      expect(userCount).toBe(1); // Should still be just the original user
    });

    it('should fail to signup user if userName already exists', async () => {
      // Arrange - Create a user first
      const existingUserData = {
        email: 'first@example.com',
        password: 'TestPassword123!',
        firstName: 'First',
        lastName: 'User',
        userName: 'duplicateusername',
      };

      await seedTestUser(prismaService, existingUserData);

      const signupMutation = `
    mutation Signup($data: SignupDto!) {
      signup(data: $data) {
        user {
          userId
          email
          role
        }
        token
      }
    }
  `;

      const signupInput = {
        email: 'second@example.com', // Different email
        password: 'AnotherPassword123!',
        firstName: 'Second',
        lastName: 'User',
        userName: 'DUPLICATEUSERNAME', // Same username, different case
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: signupMutation,
          variables: { data: signupInput },
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toMatchObject({
        message: expect.stringContaining(
          'Unique constraint failed on the fields: (`userName`)',
        ),
        extensions: {
          code: expect.any(String),
        },
      });
      expect(response.body.data).toBeNull();

      // Verify no additional user was created with that username
      const profileCount = await prismaService.profile.count({
        where: { userName: 'duplicateusername' },
      });
      expect(profileCount).toBe(1); // Should still be just the original profile

      // Verify the second email wasn't created at all
      const secondUser = await prismaService.user.findUnique({
        where: { email: 'second@example.com' },
      });
      expect(secondUser).toBeNull();
    });
  });
  describe('login mutation', () => {
    it('should successfully login an existing user and return profile', async () => {
      // Arrange - Create a test user first
      const testUserData = {
        email: 'LOGINTEST@EXAMPLE.COM', // Test case handling
        password: 'TestPassword123!',
        firstName: 'Login',
        lastName: 'Test',
        userName: 'LOGINTEST123', // Test case handling
      };

      await seedTestUser(prismaService, testUserData);

      const loginMutation = `
        mutation Login($data: LoginDto!) {
          login(data: $data) {
            user {
              userId
              email
              role
              profile {
                id
                firstName
                lastName
                userName
                isPublic
              }
            }
            token
          }
        }
      `;

      const loginInput = {
        userNameOrEmail: 'LOGINTEST@EXAMPLE.COM', // Test case insensitive login
        password: 'TestPassword123!',
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: loginMutation,
          variables: { data: loginInput },
        })
        .expect(200);

      // Assert response structure
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.login).toBeDefined();

      const { user, token } = response.body.data.login;

      // Validate user data
      expect(user).toMatchObject({
        userId: expect.any(String),
        email: 'logintest@example.com', // Should be lowercase
        role: 'USER',
      });

      // Validate profile data
      expect(user.profile).toMatchObject({
        id: expect.any(String),
        firstName: 'Login',
        lastName: 'Test',
        userName: 'logintest123', // Should be lowercase
        isPublic: true,
      });

      // Validate token
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // Verify token was created in database
      const dbUser = await prismaService.user.findUnique({
        where: { email: 'logintest@example.com' },
        include: { profile: true },
      });

      if (!dbUser) {
        fail('User was not in the database after login');
      }

      const tokenRecord = await prismaService.token.findFirst({
        where: { userId: dbUser.userId },
        orderBy: { createdAt: 'desc' },
      });

      if (!tokenRecord) {
        fail('Token record was not in the database after login');
      }

      expect(tokenRecord).toBeDefined();
      expect(tokenRecord.token).toBe(token);
    });

    it('should successfully login with username and return complete profile', async () => {
      // Arrange - Create a test user first
      const testUserData = {
        email: 'usernametest@example.com',
        password: 'TestPassword123!',
        firstName: 'Username',
        lastName: 'Test',
        userName: 'usernametest123',
      };

      await seedTestUser(prismaService, testUserData);

      const loginMutation = `
        mutation Login($data: LoginDto!) {
          login(data: $data) {
            user {
              userId
              email
              role
              profile {
                id
                firstName
                lastName
                userName
                isPublic
              }
            }
            token
          }
        }
      `;

      const loginInput = {
        userNameOrEmail: 'USERNAMETEST123', // Using uppercase username to test case handling
        password: 'TestPassword123!',
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: loginMutation,
          variables: { data: loginInput },
        })
        .expect(200);

      // Assert
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.login).toBeDefined();

      const { user, token } = response.body.data.login;

      // Validate user found by username
      expect(user).toMatchObject({
        userId: expect.any(String),
        email: 'usernametest@example.com',
        role: 'USER',
      });

      // Validate complete profile data
      expect(user.profile).toMatchObject({
        id: expect.any(String),
        firstName: 'Username',
        lastName: 'Test',
        userName: 'usernametest123',
        isPublic: true,
      });

      expect(token).toBeDefined();
    });
  });
});
