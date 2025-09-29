import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SeasonEntity } from './season.entity';
import { SeasonService } from './season.service';
import { SeasonDomain } from './season.domain';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';

@Resolver(() => SeasonEntity)
export class SeasonResolver {
  constructor(private readonly seasonService: SeasonService) {}

  @Query(() => [SeasonEntity!]!, { name: 'getAllSeasons', nullable: false })
  async getAllSeasons(): Promise<SeasonDomain[]> {
    return await this.seasonService.getAllSeasons();
  }

  @Query(() => SeasonEntity!, { name: 'getSeason', nullable: false })
  async getSeasonById(
    @Args('seasonId', { type: () => Int }) seasonId: SeasonDomain['seasonId'],
  ): Promise<SeasonDomain> {
    return await this.seasonService.getSeasonById(seasonId);
  }

  @Query(() => SeasonEntity, { name: 'getCurrentSeason', nullable: true })
  async getCurrentSeason(): Promise<SeasonDomain | null> {
    return await this.seasonService.getCurrentSeason();
  }

  @Mutation(() => SeasonEntity!, { name: 'createSeason', nullable: false })
  async createSeason(
    @Args('input') createSeasonDto: CreateSeasonDto,
  ): Promise<SeasonDomain> {
    return await this.seasonService.createSeason(createSeasonDto);
  }

  @Mutation(() => SeasonEntity!, { name: 'updateSeason', nullable: false })
  async updateSeason(
    @Args('seasonId', { type: () => Int }) seasonId: SeasonDomain['seasonId'],
    @Args('input') updateSeasonDto: UpdateSeasonDto,
  ): Promise<SeasonDomain> {
    return await this.seasonService.updateSeason(seasonId, updateSeasonDto);
  }

  @Mutation(() => Boolean!, { name: 'deleteSeason', nullable: false })
  async deleteSeason(
    @Args('seasonId', { type: () => Int }) seasonId: SeasonDomain['seasonId'],
  ): Promise<boolean> {
    return await this.seasonService.deleteSeason(seasonId);
  }
}
