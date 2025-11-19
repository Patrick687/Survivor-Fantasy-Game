import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Episode, Prisma } from '@prisma/client';

@Injectable()
export class EpisodeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findBySeasonIdAndNumber(
    seasonId: number,
    episodeNumber: number,
  ): Promise<Episode | null> {
    return this.prismaService.episode.findUnique({
      where: {
        seasonId_episodeNumber: {
          seasonId,
          episodeNumber,
        },
      },
    });
  }

  async findBySeasonId(seasonId: number): Promise<Episode[]> {
    return this.prismaService.episode.findMany({
      where: {
        seasonId,
      },
    });
  }

  async createEpisode(
    data: Prisma.EpisodeUncheckedCreateInput,
  ): Promise<Episode> {
    return this.prismaService.episode.create({
      data,
    });
  }

  async updateEpisode(
    seasonId: number,
    episodeNumber: number,
    data: Prisma.EpisodeUpdateInput,
  ): Promise<Episode> {
    return this.prismaService.episode.update({
      where: {
        seasonId_episodeNumber: {
          seasonId,
          episodeNumber,
        },
      },
      data,
    });
  }

  async deleteEpisode(
    seasonId: number,
    episodeNumber: number,
  ): Promise<boolean> {
    await this.prismaService.episode.delete({
      where: {
        seasonId_episodeNumber: {
          seasonId,
          episodeNumber,
        },
      },
    });
    return true;
  }
}
