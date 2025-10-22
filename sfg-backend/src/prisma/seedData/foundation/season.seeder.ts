// src/prisma/seedData/foundation/season.seeder.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  SeasonWithSurvivorsForSeeding,
  SeasonCreateData,
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
    const { survivors, ...seasonBasicData } = this.seasonData;

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

    // Create survivor seeder that works within the existing transaction
    const survivorSeeder = new SeasonSurvivorSeeder(
      this.prisma, // Pass the service (we'll modify the seeder to accept transaction)
      seasonId,
      this.seasonData.survivors,
    );

    // Call a new method that accepts the transaction
    await survivorSeeder.seedWithTransaction(tx);
  }
}
