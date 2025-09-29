// src/season/season.repository.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Season } from '@prisma/client';

@Injectable()
export class SeasonRepository {
  private readonly logger = new Logger(SeasonRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  // READ Operations
  async findAllSeasons(
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<Season[]> {
    return await prismaClient.season.findMany({
      orderBy: { seasonId: 'desc' }, // Most recent first
    });
  }

  async findSeasonById(
    seasonId: number,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<Season | null> {
    return await prismaClient.season.findUnique({
      where: { seasonId },
    });
  }

  async findSeasonsByDateRange(
    startCondition?: Prisma.SeasonWhereInput,
    endCondition?: Prisma.SeasonWhereInput,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<Season[]> {
    const whereConditions: Prisma.SeasonWhereInput[] = [];

    if (startCondition) whereConditions.push(startCondition);
    if (endCondition) whereConditions.push(endCondition);

    return await prismaClient.season.findMany({
      where: whereConditions.length > 0 ? { AND: whereConditions } : {},
      orderBy: { airStartDate: 'asc' },
    });
  }

  async findSeasons(
    where?: Prisma.SeasonWhereInput,
    orderBy?: Prisma.SeasonOrderByWithRelationInput,
    take?: number,
    skip?: number,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<Season[]> {
    return await prismaClient.season.findMany({
      where,
      orderBy,
      take,
      skip,
    });
  }

  async countSeasons(
    where?: Prisma.SeasonWhereInput,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<number> {
    return await prismaClient.season.count({ where });
  }

  // CREATE Operations
  async createSeason(
    data: Prisma.SeasonCreateInput,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<Season> {
    const season = await prismaClient.season.create({
      data,
    });

    this.logger.debug(`Created season with ID: ${season.seasonId}`);
    return season;
  }

  async createMultipleSeasons(
    seasonsData: Prisma.SeasonCreateInput[],
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<Season[]> {
    // If we're not already in a transaction, create one
    if (prismaClient === this.prisma) {
      return await this.prisma.$transaction(async (tx) => {
        return await this.createMultipleSeasons(seasonsData, tx);
      });
    }

    // Execute within the provided transaction
    const seasons: Season[] = [];
    for (const data of seasonsData) {
      const season = await prismaClient.season.create({ data });
      seasons.push(season);
    }

    this.logger.debug(`Created ${seasons.length} seasons`);
    return seasons;
  }

  async upsertSeason(
    where: Prisma.SeasonWhereUniqueInput,
    create: Prisma.SeasonCreateInput,
    update: Prisma.SeasonUpdateInput,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<Season> {
    const season = await prismaClient.season.upsert({
      where,
      create,
      update,
    });

    this.logger.debug(`Upserted season with ID: ${season.seasonId}`);
    return season;
  }

  // UPDATE Operations
  async updateSeason(
    seasonId: number,
    data: Prisma.SeasonUpdateInput,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<Season> {
    const season = await prismaClient.season.update({
      where: { seasonId },
      data,
    });

    this.logger.debug(`Updated season with ID: ${season.seasonId}`);
    return season;
  }

  async updateSeasons(
    where: Prisma.SeasonWhereInput,
    data: Prisma.SeasonUpdateInput,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<number> {
    const result = await prismaClient.season.updateMany({
      where,
      data,
    });

    this.logger.debug(`Updated ${result.count} seasons`);
    return result.count;
  }

  // DELETE Operations
  async deleteSeason(
    seasonId: number,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<boolean> {
    try {
      await prismaClient.season.delete({
        where: { seasonId },
      });

      this.logger.debug(`Deleted season with ID: ${seasonId}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to delete season ${seasonId}: ${error.message}`,
      );
      return false;
    }
  }

  async deleteSeasons(
    where: Prisma.SeasonWhereInput,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<number> {
    const result = await prismaClient.season.deleteMany({
      where,
    });

    this.logger.debug(`Deleted ${result.count} seasons`);
    return result.count;
  }

  async deleteMultipleSeasons(
    seasonIds: number[],
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<number> {
    const result = await prismaClient.season.deleteMany({
      where: {
        seasonId: {
          in: seasonIds,
        },
      },
    });

    this.logger.debug(`Deleted ${result.count} seasons`);
    return result.count;
  }

  // EXISTS Operations
  async seasonExists(
    where: Prisma.SeasonWhereInput,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<boolean> {
    const count = await prismaClient.season.count({
      where,
      take: 1,
    });

    return count > 0;
  }

  async seasonExistsById(
    seasonId: number,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<boolean> {
    return await this.seasonExists({ seasonId }, prismaClient);
  }
}
