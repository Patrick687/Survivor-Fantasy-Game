// test/integration/season/season.resolver.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { clearDatabase } from '../utils/prisma.integration.utils';

describe('SeasonResolver (Integration)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    // Only clear season data - don't interfere with other tests
    await prismaService.season.deleteMany({});
  });

  afterAll(async () => {
    // Clean up only season data
    await prismaService.season.deleteMany({});
    await app.close();
  });

  describe('getAllSeasons query', () => {
    it('should return empty array when no seasons exist', async () => {
      const query = `
        query GetAllSeasons {
          getAllSeasons {
            seasonId
            filmingLocation
            airStartDate
            airEndDate
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      expect(response.body.data.getAllSeasons).toEqual([]);
    });

    it('should return all seasons when they exist', async () => {
      // Arrange - Create test seasons
      await prismaService.season.createMany({
        data: [
          {
            seasonId: 1,
            filmingLocation: 'Fiji',
            airStartDate: new Date('2023-01-01'),
            airEndDate: new Date('2023-03-01'),
          },
          {
            seasonId: 2,
            filmingLocation: 'Guatemala',
            airStartDate: new Date('2023-04-01'),
            airEndDate: new Date('2023-06-01'),
          },
        ],
      });

      const query = `
        query GetAllSeasons {
          getAllSeasons {
            seasonId
            filmingLocation
            airStartDate
            airEndDate
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      expect(response.body.data.getAllSeasons).toHaveLength(2);
      expect(response.body.data.getAllSeasons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            seasonId: 1,
            filmingLocation: 'Fiji',
          }),
          expect.objectContaining({
            seasonId: 2,
            filmingLocation: 'Guatemala',
          }),
        ]),
      );
    });
  });

  describe('getSeason query', () => {
    it('should return specific season when it exists', async () => {
      // Arrange
      await prismaService.season.create({
        data: {
          seasonId: 42,
          filmingLocation: 'Cook Islands',
          airStartDate: new Date('2023-09-01'),
          airEndDate: new Date('2023-12-01'),
        },
      });

      const query = `
        query GetSeason($seasonId: Int!) {
          getSeason(seasonId: $seasonId) {
            seasonId
            filmingLocation
            airStartDate
            airEndDate
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query,
          variables: { seasonId: 42 },
        })
        .expect(200);

      expect(response.body.data.getSeason).toMatchObject({
        seasonId: 42,
        filmingLocation: 'Cook Islands',
        airStartDate: '2023-09-01T00:00:00.000Z',
        airEndDate: '2023-12-01T00:00:00.000Z',
      });
    });

    it('should return error when season does not exist', async () => {
      const query = `
        query GetSeason($seasonId: Int!) {
          getSeason(seasonId: $seasonId) {
            seasonId
            filmingLocation
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query,
          variables: { seasonId: 999 },
        })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Season with ID 999 not found',
      );
    });
  });

  describe('getCurrentSeason query', () => {
    it('should return current season when one exists', async () => {
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Arrange - Create current season
      await prismaService.season.create({
        data: {
          seasonId: 100,
          filmingLocation: 'Current Island',
          airStartDate: yesterday,
          airEndDate: tomorrow,
        },
      });

      const query = `
        query GetCurrentSeason {
          getCurrentSeason {
            seasonId
            filmingLocation
            airStartDate
            airEndDate
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      expect(response.body.data.getCurrentSeason).toMatchObject({
        seasonId: 100,
        filmingLocation: 'Current Island',
      });
    });

    it('should return null when no current season exists', async () => {
      const query = `
        query GetCurrentSeason {
          getCurrentSeason {
            seasonId
            filmingLocation
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      expect(response.body.data.getCurrentSeason).toBeNull();
    });
  });

  describe('createSeason mutation', () => {
    it('should create season with all fields', async () => {
      const createMutation = `
        mutation CreateSeason($input: CreateSeasonDto!) {
          createSeason(input: $input) {
            seasonId
            filmingLocation
            airStartDate
            airEndDate
          }
        }
      `;

      const input = {
        seasonId: 45,
        filmingLocation: 'Palau',
        airStartDate: '2024-01-15T00:00:00.000Z',
        airEndDate: '2024-04-15T00:00:00.000Z',
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: createMutation,
          variables: { input },
        })
        .expect(200);

      expect(response.body.data.createSeason).toMatchObject({
        seasonId: 45,
        filmingLocation: 'Palau',
        airStartDate: '2024-01-15T00:00:00.000Z',
        airEndDate: '2024-04-15T00:00:00.000Z',
      });

      // Verify it was actually created in database
      const dbSeason = await prismaService.season.findUnique({
        where: { seasonId: 45 },
      });
      expect(dbSeason).toBeDefined();
      expect(dbSeason?.filmingLocation).toBe('Palau');
    });

    it('should create season with minimal fields (nulls)', async () => {
      const createMutation = `
        mutation CreateSeason($input: CreateSeasonDto!) {
          createSeason(input: $input) {
            seasonId
            filmingLocation
            airStartDate
            airEndDate
          }
        }
      `;

      const input = {
        seasonId: 46,
        filmingLocation: null,
        airStartDate: null,
        airEndDate: null,
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: createMutation,
          variables: { input },
        })
        .expect(200);

      expect(response.body.data.createSeason).toMatchObject({
        seasonId: 46,
        filmingLocation: null,
        airStartDate: null,
        airEndDate: null,
      });
    });

    it('should fail when airStartDate is after airEndDate', async () => {
      const createMutation = `
        mutation CreateSeason($input: CreateSeasonDto!) {
          createSeason(input: $input) {
            seasonId
          }
        }
      `;

      const input = {
        seasonId: 47,
        filmingLocation: 'Invalid Island',
        airStartDate: '2024-04-15T00:00:00.000Z',
        airEndDate: '2024-01-15T00:00:00.000Z', // Before start date
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: createMutation,
          variables: { input },
        })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Air start date must be before air end date',
      );
    });
  });

  describe('updateSeason mutation', () => {
    it('should update season with new values', async () => {
      // Arrange - Create initial season
      await prismaService.season.create({
        data: {
          seasonId: 50,
          filmingLocation: 'Old Location',
          airStartDate: new Date('2023-01-01'),
          airEndDate: new Date('2023-03-01'),
        },
      });

      const updateMutation = `
      mutation UpdateSeason($seasonId: Int!, $input: UpdateSeasonDto!) {
        updateSeason(seasonId: $seasonId, input: $input) {
          seasonId
          filmingLocation
          airStartDate
          airEndDate
        }
      }
    `;

      const input = {
        filmingLocation: 'New Location',
        airStartDate: '2023-02-01T00:00:00.000Z',
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: updateMutation,
          variables: { seasonId: 50, input },
        })
        .expect(200);

      expect(response.body.data.updateSeason).toMatchObject({
        seasonId: 50,
        filmingLocation: 'New Location',
        airStartDate: '2023-02-01T00:00:00.000Z',
        airEndDate: '2023-03-01T00:00:00.000Z', // Unchanged
      });
    });

    it('should fail when updating non-existent season', async () => {
      const updateMutation = `
        mutation UpdateSeason($seasonId: Int!, $input: UpdateSeasonDto!) {
          updateSeason(seasonId: $seasonId, input: $input) {
            seasonId
          }
        }
      `;

      const input = {
        filmingLocation: 'New Location',
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: updateMutation,
          variables: { seasonId: 999, input },
        })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Season with ID 999 not found',
      );
    });
  });

  describe('deleteSeason mutation', () => {
    it('should successfully delete existing season', async () => {
      // Arrange
      await prismaService.season.create({
        data: {
          seasonId: 60,
          filmingLocation: 'To Be Deleted',
          airStartDate: new Date('2023-01-01'),
          airEndDate: new Date('2023-03-01'),
        },
      });

      const deleteMutation = `
        mutation DeleteSeason($seasonId: Int!) {
          deleteSeason(seasonId: $seasonId)
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: deleteMutation,
          variables: { seasonId: 60 },
        })
        .expect(200);

      expect(response.body.data.deleteSeason).toBe(true);

      // Verify it was actually deleted
      const dbSeason = await prismaService.season.findUnique({
        where: { seasonId: 60 },
      });
      expect(dbSeason).toBeNull();
    });

    it('should fail when deleting non-existent season', async () => {
      const deleteMutation = `
        mutation DeleteSeason($seasonId: Int!) {
          deleteSeason(seasonId: $seasonId)
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: deleteMutation,
          variables: { seasonId: 999 },
        })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Season with ID 999 not found',
      );
    });
  });
});
