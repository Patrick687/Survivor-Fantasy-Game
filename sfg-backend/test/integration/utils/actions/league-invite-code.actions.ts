import {
  expectGraphQLError,
  expectGraphQLSuccess,
  SupportedExceptionClass,
} from '../graphql-assertions';
import { generateInviteCodeMutation } from '../mutations';
import { TestApp } from '../setup-nest-app';

export class LeagueInviteCodeActions {
  constructor(private app: TestApp) {}

  async generateInviteCode(leagueId: string, expiresInMinutes: number) {
    return this.app.mutation<'generateInviteCode'>(generateInviteCodeMutation, {
      leagueId,
      expiresInMinutes,
    });
  }

  async expectGenerateInviteCodeToSucceed(data: {
    leagueId: string;
    expiresInMinutes: number;
  }): Promise<string> {
    const response = await this.generateInviteCode(
      data.leagueId,
      data.expiresInMinutes,
    );

    expectGraphQLSuccess(response);

    const token = response.body.data.generateInviteCode as string;

    await this.validateTokenFormat(token);

    return token;
  }

  async expectGenerateInviteCodeToFail(
    data: { leagueId: string; expiresInMinutes: number },
    expectedErrorClass?: SupportedExceptionClass,
    messgeSegments?: string[],
  ): Promise<void> {
    const response = await this.generateInviteCode(
      data.leagueId,
      data.expiresInMinutes,
    );

    expectGraphQLError(response, expectedErrorClass, messgeSegments);
  }

  private async validateTokenFormat(token: string): Promise<void> {
    // Just xpect a non-empty string for now
    expect(typeof token !== 'string' || token.length === 0).toBe(false);
  }
}
