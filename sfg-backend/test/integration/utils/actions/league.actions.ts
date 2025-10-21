import { TestApp } from '../setup-nest-app';
import { createLeagueMutation } from '../mutations';
import {
  expectGraphQLError,
  expectGraphQLSuccess,
  SupportedExceptionClass,
} from '../graphql-assertions';
import { DeepPartial } from '../types/deep-partial.types';
import { LeagueValidator } from '../validators/league.validator';
import {
  CreateLeagueDto,
  LeagueEntity,
  LeagueMemberRole,
} from '../../../../generated/graphql';
import { getMyLeaguesQuery } from '../queries';

export class LeagueActions {
  constructor(private app: TestApp) {}

  async createLeague(data: CreateLeagueDto) {
    return this.app.mutation<'createLeague'>(createLeagueMutation, {
      input: data,
    });
  }

  async getMyLeagues() {
    return this.app.query<'getMyLeagues'>(getMyLeaguesQuery);
  }

  async expectCreateLeagueToSucceed(
    data: CreateLeagueDto,
  ): Promise<LeagueEntity> {
    const response = await this.createLeague(data);

    expectGraphQLSuccess(response);

    const league = response.body.data.createLeague as LeagueEntity;

    const userId = this.app.getJwtPayload()!.userId;

    const expectedLeague: DeepPartial<LeagueEntity> = {
      leagueName: data.name,
      season: {
        seasonId: data.seasonId,
      },
      createdBy: {
        role: LeagueMemberRole.OWNER,
        user: {
          userId,
        },
      },
      members: [
        {
          role: LeagueMemberRole.OWNER,
          user: {
            userId,
          },
        },
      ],
    };

    this.validateLeague(league, expectedLeague);

    return league;
  }

  async expectGetMyLeaguesToSucceed(
    expectedLeagues: DeepPartial<LeagueEntity>[],
  ) {
    const response = await this.getMyLeagues();
    expectGraphQLSuccess(response);
    const leagues = response.body.data.getMyLeagues;
    expect(leagues).toHaveLength(expectedLeagues.length);
    const userId = this.app.getJwtPayload()!.userId;

    for (let i = 0; i < leagues.length; i++) {
      // Sort with explicit types
      leagues.sort((a: LeagueEntity, b: LeagueEntity) =>
        a.leagueId.localeCompare(b.leagueId),
      );
      expectedLeagues.sort(
        (a: DeepPartial<LeagueEntity>, b: DeepPartial<LeagueEntity>) =>
          a.leagueId!.localeCompare(b.leagueId || ''),
      );

      this.validateLeague(leagues[i], expectedLeagues[i]);
      // Ensure the user is a member of the league
      // Cast leagues to the expected type
      const typedLeagues = leagues as LeagueEntity[];
      const isMember = typedLeagues[i].members.some(
        (member) => member.user.userId === userId,
      );
      expect(isMember).toBe(true);
    }
  }

  async expectCreateLeagueToFail(
    data: Partial<CreateLeagueDto>,
    exceptionClass?: SupportedExceptionClass,
    messageSegments?: string[],
  ) {
    const response = await this.createLeague(data as CreateLeagueDto);
    expectGraphQLError(response, exceptionClass, messageSegments);
  }

  async expectGetMyLeaguesToFail(
    exceptionClass?: SupportedExceptionClass,
    messageSegments?: string[],
  ) {
    const response = await this.getMyLeagues();
    expectGraphQLError(response, exceptionClass, messageSegments);
  }

  private validateLeague(
    league: LeagueEntity,
    expectedLeague: DeepPartial<LeagueEntity>,
  ) {
    LeagueValidator.validate(league, expectedLeague);
  }
}
