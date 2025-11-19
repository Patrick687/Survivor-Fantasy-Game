import { INestApplication, NotFoundException } from '@nestjs/common';
import createTestApp from '../utils/setup-nest-app';
import cleanUpData from '../utils/clean-up-data';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { EpisodeResolver } from '../../../src/season/episode/episode.resolver';

describe('EpisodeResolver', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let episodeResolver: EpisodeResolver;

  beforeAll(async () => {
    const { app: testApp, services } = await createTestApp();

    app = testApp;
    prisma = services.prismaService;
    episodeResolver = services.episodeResolver;
  });

  beforeEach(async () => {
    await cleanUpData(prisma);
  });
  afterEach(async () => {
    await cleanUpData(prisma);
  });

  describe('getEpisodeBySeasonIdAndNumber', () => {
    it('should return the episode for the given seasonId and episodeNumber', async () => {
      const season = await prisma.season.create({
        data: {
          seasonId: 1,
        },
      });
      const episode = await prisma.episode.create({
        data: {
          seasonId: 1,
          episodeNumber: 1,
          title: 'Pilot',
          airDate: new Date(Date.now()),
        },
      });

      await episodeResolver.getEpisodeBySeasonIdAndNumber(1, 1);
    });

    it('should throw NotFoundException if the episode does not exist', async () => {
      await episodeResolver
        .getEpisodeBySeasonIdAndNumber(999, 999)
        .catch((error) => {
          expect(error.status).toBe(404);
          expect(error.message).toBe(
            'Episode with number 999 for season ID 999 not found.',
          );
          expect(error).toBeInstanceOf(NotFoundException);
        });
    });
  });

  describe('getEpisodesBySeasonId', () => {});

  describe('createEpisode', () => {});
});
