import { Query, Resolver } from '@nestjs/graphql';
import { Season } from '../graphql/graphql';
import { SeasonService } from './season.service';

@Resolver(() => Season)
export class SeasonResolver {
    constructor(private readonly seasonService: SeasonService) { }

    @Query(() => [Season], { name: 'getAllSeasons' })
    async getAllSeasons(): Promise<Season[]> {
        const seasons = await this.seasonService.getAllSeasons();
        return seasons.map(season => ({
            ...season,
            startDate: season.startDate ? season.startDate.toISOString() : null,
            endDate: season.endDate ? season.endDate.toISOString() : null,
        }));
    }
}