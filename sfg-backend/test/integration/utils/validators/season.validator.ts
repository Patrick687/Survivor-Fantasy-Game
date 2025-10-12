import { SeasonEntity } from 'generated/graphql';
import { DeepPartial } from '../types/deep-partial.types';

export class SeasonValidator {
  static validate(
    season: SeasonEntity,
    expectedSeason: DeepPartial<SeasonEntity>,
  ) {
    if (expectedSeason.seasonId) {
      expect(season.seasonId).toBe(expectedSeason.seasonId);
    }
    if (expectedSeason.airStartDate) {
      expect(new Date(season.airStartDate).toISOString()).toBe(
        new Date(expectedSeason.airStartDate).toISOString(),
      );
    }
    if (expectedSeason.airEndDate) {
      expect(new Date(season.airEndDate).toISOString()).toBe(
        new Date(expectedSeason.airEndDate).toISOString(),
      );
    }
    if (expectedSeason.filmingLocation) {
      expect(season.filmingLocation).toBe(expectedSeason.filmingLocation);
    }
  }
}
