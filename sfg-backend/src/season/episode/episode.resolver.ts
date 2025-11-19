import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Episode } from './episode.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/token/jwt-auth.guard';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDto } from './create-episode.dto';
import { UpdateEpisodeDto } from './update-episode.dto';
import { AdminGuard } from '../../common/guards/admin-role.guard';

@Resolver(() => Episode)
export class EpisodeResolver {
  constructor(private readonly episodeService: EpisodeService) {}
  @Query(() => Episode, {
    name: 'getEpisodeBySeasonIdAndNumber',
    nullable: false,
  })
  @UseGuards(JwtAuthGuard)
  async getEpisodeBySeasonIdAndNumber(
    @Args('seasonId', { type: () => Int }) seasonId: number,
    @Args('episodeNumber', { type: () => Int }) episodeNumber: number,
  ): Promise<Episode> {
    return this.episodeService.getBySeasonIdAndNumber(seasonId, episodeNumber);
  }

  @Query(() => [Episode], {
    name: 'getEpisodesBySeasonId',
    nullable: false,
  })
  @UseGuards(JwtAuthGuard)
  async getEpisodesBySeasonId(
    @Args('seasonId', { type: () => Int }) seasonId: number,
  ): Promise<Episode[]> {
    return await this.episodeService.getEpisodesBySeasonId(seasonId);
  }

  @Mutation(() => Episode, { name: 'createEpisode', nullable: false })
  @AdminGuard()
  async createEpisode(@Args('data') data: CreateEpisodeDto): Promise<Episode> {
    return await this.episodeService.createEpisode(data);
  }

  @Mutation(() => Episode, { name: 'updateEpisode', nullable: false })
  @AdminGuard()
  async updateEpisode(@Args('data') data: UpdateEpisodeDto): Promise<Episode> {
    return await this.episodeService.updateEpisode(data);
  }

  @Mutation(() => Boolean, { name: 'deleteEpisode', nullable: false })
  @AdminGuard()
  async deleteEpisode(
    @Args('seasonId', { type: () => Int }) seasonId: number,
    @Args('episodeNumber', { type: () => Int }) episodeNumber: number,
  ): Promise<boolean> {
    return await this.episodeService.deleteEpisode(seasonId, episodeNumber);
  }
}
