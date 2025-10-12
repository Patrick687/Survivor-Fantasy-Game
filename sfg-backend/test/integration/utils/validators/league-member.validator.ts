import { LeagueMemberEntity, LeagueMemberRole } from 'generated/graphql';
import { UserValidator } from './user.validator';
import { LeagueValidator } from './league.validator';
import { DeepPartial } from '../types/deep-partial.types';

export class LeagueMemberValidator {
  static validate(
    member: LeagueMemberEntity,
    expectedLeagueMember: DeepPartial<LeagueMemberEntity>,
  ) {
    if (expectedLeagueMember.id) {
      expect(member.id).toBe(expectedLeagueMember.id);
    }
    if (expectedLeagueMember.role) {
      expect(member.role).toBe(expectedLeagueMember.role);
    }
    if (expectedLeagueMember.user) {
      UserValidator.validate(member.user, expectedLeagueMember.user);
    }
    if (expectedLeagueMember.league) {
      LeagueValidator.validate(member.league, expectedLeagueMember.league);
    }
  }
}
