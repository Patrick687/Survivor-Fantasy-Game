import { TestApp } from '../setup-nest-app';
import {
  CreateLeagueDto,
  LeagueEntity,
  LeagueMemberRole,
  UserRole,
} from 'generated/graphql';
import { createLeagueMutation } from '../mutations';
import { expectGraphQLSuccess } from '../graphql-assertions';
import { LeagueValidator } from '../validators/league.validator';
import { DeepPartial } from '../types/deep-partial.types';

export class LeagueBuilder {
  constructor() {}

  public static async build(
    app: TestApp,
    leagueInfo?: CreateLeagueDto,
    options?: { validate?: boolean },
  ): Promise<LeagueEntity> {
    const defaultLeagueInfo: CreateLeagueDto = {
      seasonId: 1,
      name: 'Default Test League',
    };

    const shouldValidate = options?.validate !== false;

    const data = { ...defaultLeagueInfo, ...(leagueInfo || {}) };

    const response = await app.mutation<'createLeague'>(createLeagueMutation, {
      input: data,
    });

    if (shouldValidate) {
      expectGraphQLSuccess(response);
    }

    const leagueEntity: LeagueEntity = response.body.data
      .createLeague as LeagueEntity;

    if (shouldValidate) {
      this.validateLeagueEntity(leagueEntity, data, app);
    }

    return leagueEntity;
  }

  private static validateLeagueEntity(
    leagueEntity: LeagueEntity,
    inputData: CreateLeagueDto,
    app: TestApp,
  ) {
    const jwtPayload = app.getJwtPayload();

    // Build expected league data based on input and auth user
    const expectedLeague: DeepPartial<LeagueEntity> = {
      leagueName: inputData.name,
      season: {
        seasonId: inputData.seasonId,
      },
      createdBy: {
        role: LeagueMemberRole.OWNER,
        user: {
          userId: jwtPayload?.userId,
          role: jwtPayload?.userRole,
        },
      },
      members: [
        {
          role: LeagueMemberRole.OWNER,
          user: {
            userId: jwtPayload?.userId,
            role: jwtPayload?.userRole,
          },
        },
      ],
    };

    // Use LeagueValidator to validate the structure
    LeagueValidator.validate(leagueEntity, expectedLeague);
  }
}
