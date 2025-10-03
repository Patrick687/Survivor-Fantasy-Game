import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserDomain } from 'src/user/user.domain';
import { LeagueMemberRepository } from './league-member.repository';
import { League, LeagueMemberRole, Prisma } from '@prisma/client';
import { LeagueMemberEntity } from './entities/league-member.entity';
import { User } from 'src/user/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeagueMemberService {
  constructor(
    private readonly leagueMemberRepository: LeagueMemberRepository,
  ) {}

  async createLeagueOwner(
    data: Prisma.LeagueMemberUncheckedCreateInput,
    prismaClient?: PrismaService | Prisma.TransactionClient,
  ) {
    return await this.leagueMemberRepository.createLeagueMember(
      data.userId,
      data.leagueId,
      LeagueMemberRole.OWNER,
      prismaClient,
    );
  }

  async addMemberToLeague(
    userId: User['userId'],
    leagueId: League['leagueId'],
    prismaClient?: PrismaService | Prisma.TransactionClient,
  ) {
    return await this.leagueMemberRepository.createLeagueMember(
      userId,
      leagueId,
      LeagueMemberRole.MEMBER,
      prismaClient,
    );
  }

  async getLeagueMember(
    userId: LeagueMemberEntity['userId'],
    leagueId: League['leagueId'],
  ): Promise<LeagueMemberEntity> {
    const members =
      await this.leagueMemberRepository.getMembersByUserId(userId);
    const member = members.find((m) => m.leagueId === leagueId);
    if (!member) {
      throw new InternalServerErrorException(
        `League member not found for userId: ${userId} and leagueId: ${leagueId}`,
      );
    }
    return {
      ...member,
    };
  }

  async getAllMembersForLeague(
    leagueId: League['leagueId'],
  ): Promise<LeagueMemberEntity[]> {
    const leagueMemberData =
      await this.leagueMemberRepository.getMembersByLeagueId(leagueId);
    return leagueMemberData.map((member) => ({
      ...member,
    }));
  }

  async getAllMembersForUser(
    userId: UserDomain['userId'],
  ): Promise<LeagueMemberEntity[]> {
    const leagueMemberData =
      await this.leagueMemberRepository.getMembersByUserId(userId);
    return leagueMemberData.map((member) => ({
      ...member,
    }));
  }
}
