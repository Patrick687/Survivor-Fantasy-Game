import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { SeasonSeeder } from './season.seeder';
import { season48 } from './data/seasons/season-48';
import { SeasonWithSurvivorsForSeeding } from '../types/season-data.type';

@Injectable()
export class SeedFoundationDataService {
  private readonly logger = new Logger(SeedFoundationDataService.name);

  constructor(private readonly prisma: PrismaService) {}

  async seedFoundationData(): Promise<void> {
    this.logger.log('🌱 Starting foundation data seeding...');

    try {
      // Array of all seasons to seed
      const seasonsToSeed: SeasonWithSurvivorsForSeeding[] = [
        season48,
        // Add more seasons here as you create them
        // season47,
        // season46,
      ];

      // Seed all seasons
      for (const seasonData of seasonsToSeed) {
        await this.seedSeason(seasonData);
      }

      this.logger.log('✅ Foundation data seeding completed successfully!');
    } catch (error) {
      this.logger.error('❌ Foundation data seeding failed:', error);
      throw error;
    }
  }

  private async seedSeason(
    seasonData: SeasonWithSurvivorsForSeeding,
  ): Promise<void> {
    const seasonSeeder = new SeasonSeeder(seasonData, this.prisma);
    await seasonSeeder.seed();
  }
}
