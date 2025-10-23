// src/prisma/seedData/foundation/episode.seeder.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  EpisodeForSeeding,
  EpisodeCreateData,
} from '../types/season-data.type';
import { Prisma } from '@prisma/client';

@Injectable()
export class EpisodeSeeder {
  private readonly logger = new Logger(EpisodeSeeder.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly seasonId: number,
    private readonly episodeData: EpisodeForSeeding[],
  ) {}

  async seedWithTransaction(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.log(
      `🌱 Seeding ${this.episodeData.length} episodes for season ${this.seasonId}`,
    );

    try {
      // Validate episode numbering (should start at 1 and be sequential)
      this.validateEpisodeOrder();

      // Create episodes in order
      await this.createEpisodesInOrder(tx);

      this.logger.log(
        `✅ Successfully seeded episodes for season ${this.seasonId}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to seed episodes for season ${this.seasonId}:`,
        error,
      );
      throw error;
    }
  }

  private validateEpisodeOrder(): void {
    // Sort by episode number to validate order
    const sortedEpisodes = [...this.episodeData].sort(
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
  ): Promise<void> {
    // Sort by episode number to ensure we create them in order
    const sortedEpisodes = [...this.episodeData].sort(
      (a, b) => a.episodeNumber - b.episodeNumber,
    );

    for (const episodeEntry of sortedEpisodes) {
      const episodeCreateInput: EpisodeCreateData = {
        seasonId: this.seasonId,
        episodeNumber: episodeEntry.episodeNumber,
        title: episodeEntry.title,
        airDate: episodeEntry.airDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await tx.episode.upsert({
        where: {
          seasonId_episodeNumber: {
            seasonId: this.seasonId,
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
