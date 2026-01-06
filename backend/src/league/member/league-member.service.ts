import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { League, LeagueRole, Prisma, User } from '@prisma/client';
import { LeagueMemberRepository } from './league-member.repository';
import { LeagueMember } from './league-member.entity';

@Injectable()
export class LeagueMemberService {
  constructor(
    private readonly leagueMemberRepository: LeagueMemberRepository,
  ) {}

  async isUserInLeague(
    userId: User['id'],
    leagueId: League['id'],
  ): Promise<boolean> {
    const leagueMember =
      await this.leagueMemberRepository.findLeagueMemberByUnique({
        leagueId_userId: {
          leagueId,
          userId,
        },
      });
    return leagueMember !== null;
  }

  async getLeagueMemberByUserAndLeague(
    userId: User['id'],
    leagueId: League['id'],
  ): Promise<LeagueMember> {
    const leagueMember =
      await this.leagueMemberRepository.findLeagueMemberByUnique({
        leagueId_userId: {
          leagueId,
          userId,
        },
      });
    if (!leagueMember) {
      throw new NotFoundException(
        `League member not found for user ${userId} in league ${leagueId}`,
      );
    }

    return leagueMember;
  }

  async getLeagueMembers(leagueId: League['id']): Promise<LeagueMember[]> {
    return await this.leagueMemberRepository.findLeagueMembersByLeagueId(
      leagueId,
    );
  }

  async createLeagueMember(
    leagueMemberCreateArgs: Prisma.LeagueMemberUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<LeagueMember> {
    await this.isUserInLeague(
      leagueMemberCreateArgs.userId,
      leagueMemberCreateArgs.leagueId,
    ).then((isInLeague) => {
      if (isInLeague) {
        throw new ConflictException(
          `User ${leagueMemberCreateArgs.userId} is already a member of league ${leagueMemberCreateArgs.leagueId}`,
        );
      }
    });

    return await this.leagueMemberRepository.createLeagueMember(
      leagueMemberCreateArgs,
      tx,
    );
  }

  async createLeagueOwner(
    { userId, leagueId }: { userId: User['id']; leagueId: League['id'] },
    tx: Prisma.TransactionClient,
  ): Promise<LeagueMember> {
    return await this.createLeagueMember(
      {
        userId,
        leagueId,
        role: LeagueRole.OWNER,
      },
      tx,
    );
  }
}
