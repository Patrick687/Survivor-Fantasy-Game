import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Episode } from './episode.entity';
import { EpisodeRepository } from './episode.repository';
import { CreateEpisodeDto } from './create-episode.dto';
import { SeasonService } from '../season.service';
import { UpdateEpisodeDto } from './update-episode.dto';

@Injectable()
export class EpisodeService {
  constructor(
    private readonly episodeRepository: EpisodeRepository,
    private readonly seasonService: SeasonService,
  ) {}

  async getBySeasonIdAndNumber(
    seasonId: number,
    episodeNumber: number,
  ): Promise<Episode> {
    const episode: Episode | null =
      await this.episodeRepository.findBySeasonIdAndNumber(
        seasonId,
        episodeNumber,
      );

    if (!episode) {
      throw new NotFoundException(
        `Episode with number ${episodeNumber} for season ID ${seasonId} not found.`,
      );
    }

    return episode;
  }

  async getEpisodesBySeasonId(seasonId: number): Promise<Episode[]> {
    const episodes: Episode[] =
      await this.episodeRepository.findBySeasonId(seasonId);

    return episodes;
  }

  async createEpisode(data: CreateEpisodeDto): Promise<Episode> {
    const season = await this.seasonService.getSeasonById(data.seasonId);

    const existingEpisode =
      await this.episodeRepository.findBySeasonIdAndNumber(
        data.seasonId,
        data.episodeNumber,
      );

    if (existingEpisode) {
      throw new ConflictException(
        `Episode number ${data.episodeNumber} already exists for season ID ${data.seasonId}.`,
      );
    }

    const newEpisode: Episode =
      await this.episodeRepository.createEpisode(data);

    return newEpisode;
  }

  async updateEpisode(data: UpdateEpisodeDto): Promise<Episode> {
    const episode = await this.episodeRepository.findBySeasonIdAndNumber(
      data.seasonId,
      data.episodeNumber,
    );

    if (!episode) {
      throw new NotFoundException(
        `Episode with number ${data.episodeNumber} for season ID ${data.seasonId} not found.`,
      );
    }

    const { seasonId, episodeNumber, ...updateData } = data;

    const updatedEpisode: Episode = await this.episodeRepository.updateEpisode(
      data.seasonId,
      data.episodeNumber,
      updateData,
    );

    return await this.episodeRepository.updateEpisode(
      data.seasonId,
      data.episodeNumber,
      updateData,
    );
  }

  async deleteEpisode(
    seasonId: number,
    episodeNumber: number,
  ): Promise<boolean> {
    const episode = await this.episodeRepository.findBySeasonIdAndNumber(
      seasonId,
      episodeNumber,
    );

    if (!episode) {
      throw new NotFoundException(
        `Episode with number ${episodeNumber} for season ID ${seasonId} not found.`,
      );
    }

    await this.episodeRepository.deleteEpisode(seasonId, episodeNumber);
    return true;
  }
}
