import { INestApplication } from '@nestjs/common';
import { JwtService } from './jwt/jwt.service';
import request from 'supertest';
import { PrismaService } from 'src/prisma/prisma.service';
import clearDatabase from 'src/test/integration/utils/clearDatabase';
import initApp from 'src/test/integration/utils/initApp';
import sendGraphQLRequest from 'src/test/integration/utils/sendGraphqlRequest';
import { SignupInput } from './dto/signup.input';

const signupMutation = `
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      me {
        userId
        userName
        email
        firstName
        lastName
      }
    }
  }
`;

const signupMutationNoMe = `
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
    }
  }
`;

const loginMutation = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      me {
        userId
        userName
        email
        firstName
        lastName
      }
    }
  }
`;

const loginMutationNoMe = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
    }
  }
`;

const logoutMutation = `
  mutation {
    logout
  }
`;

const meQuery = `
  query {
    me {
      userId
      userName
      email
      firstName
      lastName
      isPrivate
    }
  }
`;

const testUser: SignupInput = {
  email: 'tesT3@test.com',
  firstName: 'test',
  isPrivate: false,
  lastName: 'test',
  password: 'Asdf1234!',
  userName: 'test21234',
};

describe('AuthResolver Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    ({ app, prisma, jwtService } = await initApp());
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
  });

  // --- SIGNUP TESTS ---
  describe('Signup', () => {
    it('should signup a user and resolve me field', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: signupMutation,
          variables: { input: testUser },
        });

      const data = response.body.data.signup;
      expect(typeof data.token).toBe('string');
      expect(data.token.length).toBeGreaterThan(10);
      expect(data.me.userId).toBeDefined();
      expect(data.me.userName).toBe(testUser.userName);
      expect(data.me.email).toBe(testUser.email);
      expect(data.me.firstName).toBe(testUser.firstName);
      expect(data.me.lastName).toBe(testUser.lastName);

      // Check database
      const userRecord = await prisma.user.findFirst({
        where: { userName: testUser.userName, email: testUser.email },
      });
      expect(userRecord).toBeDefined();
      expect(userRecord?.firstName).toBe(testUser.firstName);
      expect(userRecord?.lastName).toBe(testUser.lastName);
      expect(userRecord?.isPrivate).toBe(testUser.isPrivate);
      expect(userRecord?.email).toBe(testUser.email);
      expect(userRecord?.userName).toBe(testUser.userName);
    });

    it('should signup a user without resolving me field', async () => {
      const response = await sendGraphQLRequest(app, signupMutationNoMe).send({
        query: signupMutationNoMe,
        variables: { input: testUser },
      });

      const data = response.body.data.signup;
      expect(typeof data.token).toBe('string');
      expect(data.token.length).toBeGreaterThan(10);
      expect(data.me).toBeUndefined();

      // Check database
      const userRecord = await prisma.user.findFirst({
        where: { userName: testUser.userName, email: testUser.email },
      });
      expect(userRecord).toBeDefined();
      expect(userRecord?.firstName).toBe(testUser.firstName);
      expect(userRecord?.lastName).toBe(testUser.lastName);
      expect(userRecord?.isPrivate).toBe(testUser.isPrivate);
      expect(userRecord?.email).toBe(testUser.email);
      expect(userRecord?.userName).toBe(testUser.userName);
    });

    describe('Should fail to signup', () => {
      describe('with conflicting userName or Email', () => {
        const origTestUser: SignupInput = {
          email: 'originaluser@mail.com',
          firstName: 'Original',
          isPrivate: false,
          lastName: 'User',
          password: 'Orig1nal!',
          userName: 'originaluser',
        };
        beforeEach(async () => {
          await sendGraphQLRequest(app, signupMutationNoMe).send({
            query: signupMutationNoMe,
            variables: { input: origTestUser },
          });
        });
        it('should not allow duplicate userName', async () => {
          const response = await sendGraphQLRequest(
            app,
            signupMutationNoMe,
          ).send({
            query: signupMutationNoMe,
            variables: {
              input: { ...origTestUser, email: 'auniqueemail@mail.com' },
            },
          });
          expect(response.body.errors).toBeDefined();
          expect(response.body.data).toBeNull();
        });

        it('should not allow duplicate userName (regardless of casing)', async () => {
          const response = await sendGraphQLRequest(
            app,
            signupMutationNoMe,
          ).send({
            query: signupMutationNoMe,
            variables: {
              input: {
                ...origTestUser,
                email: 'anotherweirdmailbox@mail.com',
                userName: origTestUser.userName.toUpperCase(),
              },
            },
          });
          expect(response.body.errors).toBeDefined();
          expect(response.body.data).toBeNull();
        });

        it('should not allow duplicate email', async () => {
          const response = await sendGraphQLRequest(
            app,
            signupMutationNoMe,
          ).send({
            query: signupMutationNoMe,
            variables: {
              input: { ...origTestUser, userName: 'auniqueusername' },
            },
          });
          expect(response.body.errors).toBeDefined();
          expect(response.body.data).toBeNull();
        });

        it('should not allow duplicate email with different casing', async () => {
          const response = await sendGraphQLRequest(
            app,
            signupMutationNoMe,
          ).send({
            query: signupMutationNoMe,
            variables: {
              input: {
                ...origTestUser,
                email: origTestUser.email.toUpperCase(),
                userName: 'auniqueusername',
              },
            },
          });
          expect(response.body.errors).toBeDefined();
          expect(response.body.data).toBeNull();
        });
      });
    });
  });

  // --- LOGIN TESTS ---
  describe('Login', () => {
    beforeEach(async () => {
      await sendGraphQLRequest(app, signupMutationNoMe).send({
        query: signupMutationNoMe,
        variables: { input: testUser },
      });
    });

    it('should login with username (case-insensitive) and resolve me', async () => {
      const response = await sendGraphQLRequest(app, loginMutation).send({
        query: loginMutation,
        variables: {
          input: {
            userNameOrEmail: testUser.userName,
            password: testUser.password,
          },
        },
      });
      const data = response.body.data.login;
      expect(typeof data.token).toBe('string');
      expect(data.token.length).toBeGreaterThan(10);
      expect(data.me.userName).toBe(testUser.userName);
      expect(data.me.email).toBe(testUser.email);

      // Check database
      const userRecord = await prisma.user.findFirst({
        where: { userName: testUser.userName },
      });
      expect(userRecord).toBeDefined();
      expect(userRecord?.email).toBe(testUser.email);
    });

    it('should login with username (different casing) and resolve me', async () => {
      const response = await sendGraphQLRequest(app, loginMutation).send({
        query: loginMutation,
        variables: {
          input: {
            userNameOrEmail: testUser.userName.toUpperCase(),
            password: testUser.password,
          },
        },
      });
      const data = response.body.data.login;
      expect(typeof data.token).toBe('string');
      expect(data.token.length).toBeGreaterThan(10);
      expect(data.me.userName).toBe(testUser.userName);
      expect(data.me.email).toBe(testUser.email);

      // Check database
      const userRecord = await prisma.user.findFirst({
        where: { userName: testUser.userName },
      });
      expect(userRecord).toBeDefined();
      expect(userRecord?.email).toBe(testUser.email);
    });

    it('should login with email (case-insensitive) and resolve me', async () => {
      const response = await sendGraphQLRequest(app, loginMutation).send({
        query: loginMutation,
        variables: {
          input: {
            userNameOrEmail: testUser.email,
            password: testUser.password,
          },
        },
      });
      const data = response.body.data.login;
      expect(typeof data.token).toBe('string');
      expect(data.token.length).toBeGreaterThan(10);
      expect(data.me.userName).toBe(testUser.userName);
      expect(data.me.email).toBe(testUser.email);

      // Check database
      const userRecord = await prisma.user.findFirst({
        where: { email: testUser.email },
      });
      expect(userRecord).toBeDefined();
      expect(userRecord?.userName).toBe(testUser.userName);
    });

    it('should login with email (different casing) and resolve me', async () => {
      const response = await sendGraphQLRequest(app, loginMutation).send({
        query: loginMutation,
        variables: {
          input: {
            userNameOrEmail: testUser.email.toUpperCase(),
            password: testUser.password,
          },
        },
      });
      const data = response.body.data.login;
      expect(typeof data.token).toBe('string');
      expect(data.token.length).toBeGreaterThan(10);
      expect(data.me.userName).toBe(testUser.userName);
      expect(data.me.email).toBe(testUser.email);

      // Check database
      const userRecord = await prisma.user.findFirst({
        where: { email: testUser.email },
      });
      expect(userRecord).toBeDefined();
      expect(userRecord?.userName).toBe(testUser.userName);
    });

    it('should login without resolving me field', async () => {
      const response = await sendGraphQLRequest(app, loginMutationNoMe).send({
        query: loginMutationNoMe,
        variables: {
          input: {
            userNameOrEmail: testUser.userName,
            password: testUser.password,
          },
        },
      });
      const data = response.body.data.login;
      expect(typeof data.token).toBe('string');
      expect(data.token.length).toBeGreaterThan(10);
      expect(data.me).toBeUndefined();
    });

    it('should fail login with wrong password (username)', async () => {
      const response = await sendGraphQLRequest(app, loginMutation).send({
        query: loginMutation,
        variables: {
          input: {
            userNameOrEmail: testUser.userName,
            password: 'WrongPassword!',
          },
        },
      });
      expect(response.body.errors).toBeDefined();
      expect(response.body.data).toBeNull();
    });

    it('should fail login with wrong password (email)', async () => {
      const response = await sendGraphQLRequest(app, loginMutation).send({
        query: loginMutation,
        variables: {
          input: {
            userNameOrEmail: testUser.email,
            password: 'WrongPassword!',
          },
        },
      });
      expect(response.body.errors).toBeDefined();
      expect(response.body.data).toBeNull();
    });

    it('should fail login with unknown username', async () => {
      const response = await sendGraphQLRequest(app, loginMutation).send({
        query: loginMutation,
        variables: {
          input: {
            userNameOrEmail: 'unknownuser',
            password: testUser.password,
          },
        },
      });
      expect(response.body.errors).toBeDefined();
      expect(response.body.data).toBeNull();
    });

    it('should fail login with unknown email', async () => {
      const response = await sendGraphQLRequest(app, loginMutation).send({
        query: loginMutation,
        variables: {
          input: {
            userNameOrEmail: 'unknown@email.com',
            password: testUser.password,
          },
        },
      });
      expect(response.body.errors).toBeDefined();
      expect(response.body.data).toBeNull();
    });

    it('should fail login with missing fields', async () => {
      const response = await sendGraphQLRequest(app, loginMutation).send({
        query: loginMutation,
        variables: {
          input: {
            userNameOrEmail: '',
            password: '',
          },
        },
      });
      expect(response.body.errors).toBeDefined();
      expect(response.body.data).toBeNull();
    });
  });

  describe('VerifySession', () => {
    let validToken: string;
    beforeEach(async () => {
      // Signup to get a valid token
      const response = await sendGraphQLRequest(app, signupMutationNoMe).send({
        query: signupMutationNoMe,
        variables: { input: testUser },
      });
      validToken = response.body.data.signup.token;
    });

    it('should return authSession for a valid token', async () => {
      const verifySessionQuery = `
        query VerifySession($input: VerifySessionInput!) {
          verifySession(input: $input) {
            token
            me {
              userId
              userName
              email
              firstName
              lastName
            }
          }
        }
      `;
      const response = await sendGraphQLRequest(app, verifySessionQuery).send({
        query: verifySessionQuery,
        variables: { input: { token: validToken } },
      });
      const data = response.body.data.verifySession;
      expect(typeof data.token).toBe('string');
      expect(data.token.length).toBeGreaterThan(10);
      expect(data.me.userName).toBe(testUser.userName);
      expect(data.me.email).toBe(testUser.email);
    });

    it('should fail for an invalid token', async () => {
      const verifySessionQuery = `
        query VerifySession($input: VerifySessionInput!) {
          verifySession(input: $input) {
            token
            me {
              userId
            }
          }
        }
      `;
      const response = await sendGraphQLRequest(app, verifySessionQuery).send({
        query: verifySessionQuery,
        variables: { input: { token: 'invalid.token.value' } },
      });
      expect(response.body.errors).toBeDefined();
      expect(response.body.data).toBeNull();
    });

    it('should fail for an expired token', async () => {
      // Temporarily override JWT_EXPIRES_IN to '1s' for this test
      const originalExpiresIn = process.env.JWT_EXPIRES_IN;
      process.env.JWT_EXPIRES_IN = '1s';
      const payload = { sub: testUser.userName };
      const token = await jwtService.signWithExpiry(payload);
      // Restore env var
      process.env.JWT_EXPIRES_IN = originalExpiresIn;
      // Wait for token to expire
      await new Promise((resolve) => setTimeout(resolve, 1100));
      const verifySessionQuery = `
        query VerifySession($input: VerifySessionInput!) {
          verifySession(input: $input) {
            token
            me {
              userId
            }
          }
        }
      `;
      const response = await sendGraphQLRequest(app, verifySessionQuery).send({
        query: verifySessionQuery,
        variables: { input: token },
      });
      expect(response.body.errors).toBeDefined();
      expect(JSON.stringify(response.body.errors)).toContain('UNAUTHENTICATED');
    });
  });
});
