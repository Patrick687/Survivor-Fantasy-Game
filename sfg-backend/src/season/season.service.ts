// src/season/season.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { SeasonRepository } from './season.repository';
import { SeasonDomain } from './season.domain';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { Season } from '@prisma/client';

@Injectable()
export class SeasonService {
  private readonly logger = new Logger(SeasonService.name);

  constructor(private readonly seasonRepository: SeasonRepository) {}

  // READ Operations
  async getAllSeasons(): Promise<SeasonDomain[]> {
    this.logger.debug('Fetching all seasons');
    const seasons = await this.seasonRepository.findAllSeasons();
    return seasons.map((season) => this.mapToDomain(season));
  }

  async getSeasonById(seasonId: number): Promise<SeasonDomain> {
    this.logger.debug(`Fetching season with ID: ${seasonId}`);

    const season = await this.seasonRepository.findSeasonById(seasonId);
    if (!season) {
      throw new NotFoundException(`Season with ID ${seasonId} not found`);
    }

    return this.mapToDomain(season);
  }

  async getCurrentSeason(): Promise<SeasonDomain | null> {
    this.logger.debug('Fetching current season');
    const now = new Date();

    const seasons = await this.seasonRepository.findSeasonsByDateRange(
      { airStartDate: { lte: now } },
      { airEndDate: { gte: now } },
    );

    if (seasons.length === 0) {
      return null;
    }

    // Return the first current season (or you could add logic to handle multiple)
    return this.mapToDomain(seasons[0]);
  }

  // CREATE Operations
  async createSeason(createSeasonDto: CreateSeasonDto): Promise<SeasonDomain> {
    this.logger.debug(
      `Creating new season: ${JSON.stringify(createSeasonDto)}`,
    );

    // Validate date logic
    this.validateSeasonDates(
      createSeasonDto.airStartDate || null,
      createSeasonDto.airEndDate || null,
    );

    // The DTO transformations already handle undefined -> null conversion
    const seasonData = {
      seasonId: createSeasonDto.seasonId,
      filmingLocation: createSeasonDto.filmingLocation, // Already transformed to null if undefined
      airStartDate:
        createSeasonDto.airStartDate ?
          new Date(createSeasonDto.airStartDate)
        : null,
      airEndDate:
        createSeasonDto.airEndDate ?
          new Date(createSeasonDto.airEndDate)
        : null,
    };

    const season = await this.seasonRepository.createSeason(seasonData);
    this.logger.log(`Season created successfully with ID: ${season.seasonId}`);

    return this.mapToDomain(season);
  }

  // UPDATE Operations
  async updateSeason(
    seasonId: number,
    updateSeasonDto: UpdateSeasonDto,
  ): Promise<SeasonDomain> {
    this.logger.debug(
      `Updating season ${seasonId}: ${JSON.stringify(updateSeasonDto)}`,
    );

    // Check if season exists
    const existingSeason = await this.getSeasonById(seasonId);

    this.validateUpdateDates(existingSeason, updateSeasonDto);

    // Build update data only for fields that are explicitly provided
    const updateData: any = {};

    if (updateSeasonDto.filmingLocation !== undefined) {
      updateData.filmingLocation = updateSeasonDto.filmingLocation; // Already transformed
    }

    if (updateSeasonDto.airStartDate !== undefined) {
      updateData.airStartDate =
        updateSeasonDto.airStartDate ?
          new Date(updateSeasonDto.airStartDate)
        : null;
    }

    if (updateSeasonDto.airEndDate !== undefined) {
      updateData.airEndDate =
        updateSeasonDto.airEndDate ?
          new Date(updateSeasonDto.airEndDate)
        : null;
    }

    const updatedSeason = await this.seasonRepository.updateSeason(
      seasonId,
      updateData,
    );
    this.logger.log(`Season ${seasonId} updated successfully`);

    return this.mapToDomain(updatedSeason);
  }

  // DELETE Operations
  async deleteSeason(seasonId: number): Promise<boolean> {
    this.logger.debug(`Deleting season with ID: ${seasonId}`);

    // Check if season exists
    await this.getSeasonById(seasonId);

    const deleted = await this.seasonRepository.deleteSeason(seasonId);
    if (deleted) {
      this.logger.log(`Season ${seasonId} deleted successfully`);
    }

    return deleted;
  }

  private validateUpdateDates(
    existingSeason: SeasonDomain,
    updateDto: UpdateSeasonDto,
  ): void {
    const isUpdatingStartDate = updateDto.airStartDate !== undefined;
    const isUpdatingEndDate = updateDto.airEndDate !== undefined;

    // Case 1: Only updating start date - validate against existing end date
    if (isUpdatingStartDate && !isUpdatingEndDate) {
      const newStartDate =
        updateDto.airStartDate ? new Date(updateDto.airStartDate) : null;
      const existingEndDate = existingSeason.airEndDate;

      if (newStartDate && existingEndDate) {
        if (newStartDate >= existingEndDate) {
          throw new BadRequestException(
            'New start date must be before existing end date',
          );
        }
      }
    }

    // Case 2: Only updating end date - validate against existing start date
    if (!isUpdatingStartDate && isUpdatingEndDate) {
      const existingStartDate = existingSeason.airStartDate;
      const newEndDate =
        updateDto.airEndDate ? new Date(updateDto.airEndDate) : null;

      if (existingStartDate && newEndDate) {
        if (existingStartDate >= newEndDate) {
          throw new BadRequestException(
            'Existing start date must be before new end date',
          );
        }
      }
    }

    // Case 3: Updating both dates - validate new dates against each other only
    if (isUpdatingStartDate && isUpdatingEndDate) {
      const newStartDate =
        updateDto.airStartDate ? new Date(updateDto.airStartDate) : null;
      const newEndDate =
        updateDto.airEndDate ? new Date(updateDto.airEndDate) : null;

      if (newStartDate && newEndDate) {
        if (newStartDate >= newEndDate) {
          throw new BadRequestException(
            'New start date must be before new end date',
          );
        }
      }
    }

    // Note: If neither date is being updated, no validation needed
  }

  // Private helper methods
  private validateSeasonDates(
    startDate: Date | string | null,
    endDate: Date | string | null,
  ): void {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        throw new BadRequestException(
          'Air start date must be before air end date',
        );
      }
    }
  }

  // Domain mapping method
  private mapToDomain(season: Season): SeasonDomain {
    return new SeasonDomain(
      season.seasonId,
      season.filmingLocation,
      season.airStartDate,
      season.airEndDate,
    );
  }
}
