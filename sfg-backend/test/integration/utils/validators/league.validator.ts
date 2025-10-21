import { LeagueEntity, User } from 'generated/graphql';
import { SeasonValidator } from './season.validator';
import { LeagueMemberValidator } from './league-member.validator';
import { DeepPartial } from '../types/deep-partial.types';
import { UserValidator } from './user.validator';

export class LeagueValidator {
  static validate(
    league: LeagueEntity,
    expectedLeague: DeepPartial<LeagueEntity>,
  ) {
    if (expectedLeague.leagueId) {
      expect(league.leagueId).toBe(expectedLeague.leagueId);
    }
    if (expectedLeague.leagueName) {
      expect(league.leagueName).toBe(expectedLeague.leagueName);
    }
    if (expectedLeague.createdAt) {
      expect(new Date(league.createdAt).toISOString()).toBe(
        new Date(expectedLeague.createdAt).toISOString(),
      );
    }
    if (expectedLeague.season) {
      SeasonValidator.validate(league.season, expectedLeague.season);
    }
    if (expectedLeague.createdBy) {
      LeagueMemberValidator.validate(
        league.createdBy,
        expectedLeague.createdBy,
      );
    }
    if (expectedLeague.members && expectedLeague.members.length !== undefined) {
      expect(league.members).toBeDefined();
      expect(Array.isArray(league.members)).toBe(true);
      expect(league.members.length).toBe(expectedLeague.members.length);

      const sortedActualMembers = [...league.members].sort((a, b) => {
        const aId = a.user?.userId || a.id || '';
        const bId = b.user?.userId || b.id || '';
        return aId.localeCompare(bId);
      });

      const sortedExpectedMembers = [...expectedLeague.members].sort((a, b) => {
        // Need to handle potentially undefined members
        const aId = a?.user?.userId || a?.id || '';
        const bId = b?.user?.userId || b?.id || '';
        return aId.localeCompare(bId);
      });

      // Validate each league member
      sortedExpectedMembers.forEach((expectedMember, index) => {
        const actualMember = sortedActualMembers[index];
        if (expectedMember) {
          LeagueMemberValidator.validate(actualMember, expectedMember);
        }
      });
    }
  }

  expectUserToBeInLeague(
    league: LeagueEntity,
    user: DeepPartial<Omit<User, 'userId'>> & { userId: User['userId'] },
  ) {
    const leagueMembers = league.members;
    const foundLeagueMember = leagueMembers.findIndex(
      (lm) => lm.user.userId === user.userId,
    );
    expect(foundLeagueMember).toBeGreaterThanOrEqual(0);

    UserValidator.validate(leagueMembers[foundLeagueMember].user, user);
  }
}
