import { ApolloClient, gql } from '@apollo/client';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import clearDatabase from 'src/test/integration/utils/clearDatabase';
import { createTestUser } from 'src/test/integration/utils/createTestUser.test.utils';
import initApp from 'src/test/integration/utils/initApp';
import { TestClient } from 'src/test/integration/utils/TestClient';
import { AuthSession, Mutation } from 'test/integration/generated.types';
import { CreateLeagueInput } from './dto/create-league.input';

const CREATE_LEAGUE_MUTATION = gql`
  mutation CreateLeague($input: CreateLeagueInput!) {
    createLeague(input: $input) {
      createdAt
      description
      id
      name
      season
      updatedAt
      createdBy {
        email
        firstName
        lastName
        userId
        userName
      }
      members {
        id
        joinedAt
        role
        invitedBy {
          id
          joinedAt
          role
          user {
            email
            firstName
            lastName
            userId
            userName
          }
        }
        user {
          email
          firstName
          lastName
          userId
          userName
        }
      }
    }
  }
`;

describe('LeagueResolver (integration)', () => {
  let testClient: TestClient;
  let prisma: PrismaService;
  let app: INestApplication;

  let authSession: AuthSession;

  beforeAll(async () => {
    ({ app, prisma, testClient } = await initApp(app));
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
    authSession = await createTestUser(testClient);
    testClient.setAuthSession(authSession);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Happy Path', () => {
    it('should create a league', async () => {
      const expectedUser = testClient.session!.me;

      await prisma.season.create({
        data: {
          id: 47,
          name: 'Survivor 47',
          location: 'Fiji, Bajamas',
        },
      });

      const leagueInput: CreateLeagueInput = {
        name: 'Test League',
        seasonId: 47, // Use a valid seasonId from your test DB
        description: 'A test league',
      };

      const { data } = await testClient.client.mutate<Mutation>({
        mutation: CREATE_LEAGUE_MUTATION,
        variables: { input: leagueInput },
      });

      expect(data).toBeDefined();
      expect(data!.createLeague).toBeDefined();
      expect(data!.createLeague.id).toBeDefined();
      expect(data!.createLeague.createdBy).toBeDefined();
      expect(data!.createLeague.createdBy.userId).toBe(expectedUser.userId);
      expect(data!.createLeague.members).toHaveLength(1);
      expect(data!.createLeague.members[0].user.userId).toBe(
        expectedUser.userId,
      );
    });
  });
});
