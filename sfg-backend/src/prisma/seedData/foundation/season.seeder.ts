// src/prisma/seedData/foundation/season.seeder.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  SeasonCreateData,
  EpisodeCreateData,
  SeasonWithSurvivorsForSeeding,
} from '../types/season-data.type';
import { Prisma } from '@prisma/client';
import { SeasonSurvivorSeeder } from './survivor.seeder';

@Injectable()
export class SeasonSeeder {
  private readonly logger = new Logger(SeasonSeeder.name);

  constructor(
    private readonly seasonData: SeasonWithSurvivorsForSeeding,
    private readonly prisma: PrismaService,
  ) {}

  async seed(): Promise<void> {
    this.logger.log(`🌱 Seeding season ${this.seasonData.seasonId}`);

    try {
      await this.prisma.$transaction(async (tx) => {
        // Step 1: Create the season
        const season = await this.createSeason(tx);

        // Step 2: Seed survivors within the SAME transaction
        await this.seedSurvivorsInTransaction(tx, season.seasonId);

        // Step 3: Seed episodes within the SAME transaction
        await this.seedEpisodesInTransaction(tx, season.seasonId);
      });

      this.logger.log(
        `✅ Successfully seeded season ${this.seasonData.seasonId}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to seed season ${this.seasonData.seasonId}:`,
        error,
      );
      throw error;
    }
  }

  private async createSeason(
    tx: Prisma.TransactionClient,
  ): Promise<SeasonCreateData> {
    const { survivors, episodes, ...seasonBasicData } = this.seasonData;

    const seasonCreateInput: SeasonCreateData = {
      ...seasonBasicData,
    };

    return await tx.season.upsert({
      where: { seasonId: seasonBasicData.seasonId },
      update: {
        filmingLocation: seasonBasicData.filmingLocation,
        airStartDate: seasonBasicData.airStartDate,
        airEndDate: seasonBasicData.airEndDate,
      },
      create: seasonCreateInput,
    });
  }

  private async seedSurvivorsInTransaction(
    tx: Prisma.TransactionClient,
    seasonId: number,
  ): Promise<void> {
    if (this.seasonData.survivors.length === 0) {
      this.logger.log(`ℹ️ No survivors to seed for season ${seasonId}`);
      return;
    }

    const survivorSeeder = new SeasonSurvivorSeeder(
      this.prisma,
      seasonId,
      this.seasonData.survivors,
    );

    await survivorSeeder.seedWithTransaction(tx);
  }

  private async seedEpisodesInTransaction(
    tx: Prisma.TransactionClient,
    seasonId: number,
  ): Promise<void> {
    if (this.seasonData.episodes.length === 0) {
      this.logger.log(`ℹ️ No episodes to seed for season ${seasonId}`);
      return;
    }

    this.logger.log(
      `🌱 Seeding ${this.seasonData.episodes.length} episodes for season ${seasonId}`,
    );

    try {
      // Validate episode numbering (should start at 1 and be sequential)
      this.validateEpisodeOrder();

      // Create episodes in order
      await this.createEpisodesInOrder(tx, seasonId);

      this.logger.log(`✅ Successfully seeded episodes for season ${seasonId}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to seed episodes for season ${seasonId}:`,
        error,
      );
      throw error;
    }
  }

  private validateEpisodeOrder(): void {
    // Sort by episode number to validate order
    const sortedEpisodes = [...this.seasonData.episodes].sort(
      (a, b) => a.episodeNumber - b.episodeNumber,
    );

    for (let i = 0; i < sortedEpisodes.length; i++) {
      const expectedNumber = i + 1;
      const actualNumber = sortedEpisodes[i].episodeNumber;

      if (actualNumber !== expectedNumber) {
        throw new Error(
          `Episode numbering error: Expected episode ${expectedNumber}, but found episode ${actualNumber}. Episodes must be numbered sequentially starting from 1.`,
        );
      }
    }
  }

  private async createEpisodesInOrder(
    tx: Prisma.TransactionClient,
    seasonId: number,
  ): Promise<void> {
    // Sort by episode number to ensure we create them in order
    const sortedEpisodes = [...this.seasonData.episodes].sort(
      (a, b) => a.episodeNumber - b.episodeNumber,
    );

    for (const episodeEntry of sortedEpisodes) {
      const episodeCreateInput: EpisodeCreateData = {
        seasonId: seasonId,
        episodeNumber: episodeEntry.episodeNumber,
        title: episodeEntry.title,
        airDate: episodeEntry.airDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await tx.episode.upsert({
        where: {
          seasonId_episodeNumber: {
            seasonId: seasonId,
            episodeNumber: episodeEntry.episodeNumber,
          },
        },
        update: {
          title: episodeEntry.title,
          airDate: episodeEntry.airDate,
          updatedAt: new Date(),
        },
        create: episodeCreateInput,
      });
    }
  }
}
