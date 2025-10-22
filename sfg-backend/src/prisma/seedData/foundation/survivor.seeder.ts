// src/prisma/seedData/foundation/survivor.seeder.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  SeasonSurvivorForSeeding,
  SurvivorForSeeding,
  SurvivorCreateData,
  SeasonSurvivorCreateData,
} from '../types/season-data.type';
import { Prisma } from '@prisma/client';

type SurvivorEntryForSeeding = SeasonSurvivorForSeeding & {
  survivor: SurvivorForSeeding;
};

@Injectable()
export class SeasonSurvivorSeeder {
  private readonly logger = new Logger(SeasonSurvivorSeeder.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly seasonId: number,
    private readonly survivorData: SurvivorEntryForSeeding[],
  ) {}

  async seed(): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await this.seedWithTransaction(tx);
    });
  }

  // New method that accepts a transaction
  async seedWithTransaction(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.log(
      `🌱 Seeding ${this.survivorData.length} survivors for season ${this.seasonId}`,
    );

    try {
      // Step 1: Upsert all survivors (master table)
      const survivorMap = await this.upsertSurvivors(tx);

      // Step 2: Create season survivor records (detail table)
      await this.createSeasonSurvivors(tx, survivorMap);

      this.logger.log(
        `✅ Successfully seeded survivors for season ${this.seasonId}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to seed survivors for season ${this.seasonId}:`,
        error,
      );
      throw error;
    }
  }

  private async upsertSurvivors(
    tx: Prisma.TransactionClient,
  ): Promise<Map<string, string>> {
    const survivorMap = new Map<string, string>();

    for (const survivorEntry of this.survivorData) {
      const survivorKey = `${survivorEntry.survivor.firstName}_${survivorEntry.survivor.lastName}`;

      if (survivorMap.has(survivorKey)) {
        continue; // Skip if already processed in this batch
      }

      const survivorCreateInput: SurvivorCreateData = {
        ...survivorEntry.survivor,
        survivorId: undefined, // Let Prisma generate this
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const survivor = await tx.survivor.upsert({
        where: {
          firstName_lastName: {
            firstName: survivorEntry.survivor.firstName,
            lastName: survivorEntry.survivor.lastName,
          },
        },
        update: {
          nickName: survivorEntry.survivor.nickName,
          updatedAt: new Date(),
        },
        create: survivorCreateInput,
      });

      survivorMap.set(survivorKey, survivor.survivorId);
    }

    return survivorMap;
  }

  private async createSeasonSurvivors(
    tx: Prisma.TransactionClient,
    survivorMap: Map<string, string>,
  ): Promise<void> {
    const seasonSurvivorData: SeasonSurvivorCreateData[] = [];

    for (const survivorEntry of this.survivorData) {
      const survivorKey = `${survivorEntry.survivor.firstName}_${survivorEntry.survivor.lastName}`;
      const survivorId = survivorMap.get(survivorKey);

      if (!survivorId) {
        throw new Error(`Survivor ID not found for ${survivorKey}`);
      }

      const { survivor, ...seasonSurvivorFields } = survivorEntry;

      seasonSurvivorData.push({
        survivorId,
        seasonId: this.seasonId,
        ...seasonSurvivorFields,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Bulk create all season survivors
    await tx.seasonSurvivor.createMany({
      data: seasonSurvivorData,
      skipDuplicates: true,
    });
  }
}
