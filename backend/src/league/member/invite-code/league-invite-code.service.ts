import { ForbiddenException, Injectable } from '@nestjs/common';
import { LeagueInviteCode } from './league-invite-code.entity';
import { LeagueMember } from '../league-member.entity';
import { League, LeagueRole, User } from '@prisma/client';
import { LeagueInviteCodeRepository } from './league-invite-code.repository';
import { LeagueMemberService } from '../league-member.service';
import { LeagueService } from 'src/league/league.service';

@Injectable()
export class LeagueInviteCodeService {
  private readonly inviteCodeLength = 8;
  private readonly inviteCodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  private readonly inviteCodeExpiryMinutes = 30;

  constructor(
    private readonly leagueInviteCodeRepository: LeagueInviteCodeRepository,
    private readonly leagueMemberService: LeagueMemberService,
    private readonly leagueService: LeagueService,
  ) {}

  async useInviteCode(inviteCode: string, userId: User['id']): Promise<League> {
    const leagueInviteCode =
      await this.leagueInviteCodeRepository.getByCode(inviteCode);

    if (!leagueInviteCode) {
      throw new ForbiddenException('Invalid invite code');
    }

    if (leagueInviteCode.revokedAt) {
      throw new ForbiddenException('Invite code has been revoked');
    }

    if (leagueInviteCode.expiresAt < new Date()) {
      throw new ForbiddenException('Invite code has expired');
    }

    const isUserInLeague = await this.leagueMemberService.isUserInLeague(
      userId,
      leagueInviteCode.leagueId,
    );
    if (isUserInLeague) {
      throw new ForbiddenException('User is already a member of the league');
    }

    const leagueMember = await this.leagueMemberService.createLeagueMember({
      leagueId: leagueInviteCode.leagueId,
      userId: userId,
      role: LeagueRole.MEMBER,
      inviteCodeId: leagueInviteCode.id,
    });

    return await this.leagueService.getLeagueById(leagueMember.leagueId);
  }

  async createInviteCode(
    leagueId: League['id'],
    createdByUserId: User['id'],
  ): Promise<LeagueInviteCode> {
    //Validate user is in league
    const isUserInLeague = await this.leagueMemberService.isUserInLeague(
      createdByUserId,
      leagueId,
    );
    if (!isUserInLeague) {
      throw new ForbiddenException(
        'Only league members can create invite codes',
      );
    }

    //Validate user is an admin or owner of the league
    const leagueMemberRole = await this.leagueMemberService
      .getLeagueMemberByUserAndLeague(createdByUserId, leagueId)
      .then((member) => member.role);

    if (
      leagueMemberRole !== LeagueRole.OWNER &&
      leagueMemberRole !== LeagueRole.ADMIN
    ) {
      throw new ForbiddenException(
        'Only league owners or admins can create invite codes',
      );
    }

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.inviteCodeExpiryMinutes);

    const code = await this.generateUniqueInviteCode();
    return await this.leagueInviteCodeRepository.createInviteCode({
      leagueId,
      createdById: createdByUserId,
      code,
      expiresAt,
    });
  }

  private async generateUniqueInviteCode(): Promise<string> {
    let code: string;
    let exists = true;
    do {
      code = this.generateInviteCode();
      exists = await this.leagueInviteCodeRepository.existsByCode(code);
    } while (exists);
    return code;
  }

  private generateInviteCode(): string {
    const length = this.inviteCodeLength;
    const chars = this.inviteCodeChars;
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      const randomChar = chars.charAt(randomIndex);
      result += randomChar; // <-- fix here
    }
    return result;
  }

  async getInviteCodeCreator(
    createdByUserId: LeagueInviteCode['id'],
    leagueId: LeagueInviteCode['leagueId'],
  ): Promise<LeagueMember> {
    return await this.leagueMemberService.getLeagueMemberByUserAndLeague(
      createdByUserId,
      leagueId,
    );
  }
}
