import { CreateSeasonDto, SeasonEntity } from 'generated/graphql';
import { TestApp } from '../setup-nest-app';
import { createSeasonMutation } from '../mutations';
import {
  expectGraphQLError,
  expectGraphQLSuccess,
  SupportedExceptionClass,
} from '../graphql-assertions';
import { DeepPartial } from '../types/deep-partial.types';
import { SeasonValidator } from '../validators/season.validator';

export class SeasonActions {
  constructor(private app: TestApp) {}

  async createSeason(data: CreateSeasonDto) {
    return this.app.mutation<'createSeason'>(createSeasonMutation, {
      input: data,
    });
  }

  async expectCreateSeasonToSucceed(data: CreateSeasonDto) {
    const response = await this.createSeason(data);

    expectGraphQLSuccess(response);

    const season: SeasonEntity = response.body.data
      .createSeason as SeasonEntity;

    const expectedSeason: DeepPartial<SeasonEntity> = {
      seasonId: data.seasonId,
      filmingLocation: data.filmingLocation,
      airStartDate: data.airStartDate,
      airEndDate: data.airEndDate,
    };

    this.validateSeason(season, expectedSeason);
    return season;
  }

  async expectCreateSeasonToFail(
    data: CreateSeasonDto,
    exceptionClass?: SupportedExceptionClass,
    messageSegments?: string[],
  ): Promise<void> {
    const response = await this.createSeason(data);
    expectGraphQLError(response, exceptionClass, messageSegments);
  }

  private validateSeason(
    season: SeasonEntity,
    expectedSeason: DeepPartial<SeasonEntity>,
  ) {
    SeasonValidator.validate(season, expectedSeason);
  }
}
