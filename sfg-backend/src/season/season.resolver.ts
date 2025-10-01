import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SeasonEntity } from './season.entity';
import { SeasonService } from './season.service';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';

@Resolver(() => SeasonEntity)
export class SeasonResolver {
  constructor(private readonly seasonService: SeasonService) {}

  @Query(() => [SeasonEntity!]!, { name: 'getAllSeasons', nullable: false })
  async getAllSeasons(): Promise<SeasonEntity[]> {
    return await this.seasonService.getAllSeasons();
  }

  @Query(() => SeasonEntity!, { name: 'getSeason', nullable: false })
  async getSeasonById(
    @Args('seasonId', { type: () => Int }) seasonId: SeasonEntity['seasonId'],
  ): Promise<SeasonEntity> {
    return await this.seasonService.getSeasonById(seasonId);
  }

  @Query(() => SeasonEntity, { name: 'getCurrentSeason', nullable: true })
  async getCurrentSeason(): Promise<SeasonEntity | null> {
    return await this.seasonService.getCurrentSeason();
  }

  @Mutation(() => SeasonEntity!, { name: 'createSeason', nullable: false })
  async createSeason(
    @Args('input') createSeasonDto: CreateSeasonDto,
  ): Promise<SeasonEntity> {
    return await this.seasonService.createSeason(createSeasonDto);
  }

  @Mutation(() => SeasonEntity!, { name: 'updateSeason', nullable: false })
  async updateSeason(
    @Args('seasonId', { type: () => Int }) seasonId: SeasonEntity['seasonId'],
    @Args('input') updateSeasonDto: UpdateSeasonDto,
  ): Promise<SeasonEntity> {
    return await this.seasonService.updateSeason(seasonId, updateSeasonDto);
  }

  @Mutation(() => Boolean!, { name: 'deleteSeason', nullable: false })
  async deleteSeason(
    @Args('seasonId', { type: () => Int }) seasonId: SeasonEntity['seasonId'],
  ): Promise<boolean> {
    return await this.seasonService.deleteSeason(seasonId);
  }
}
