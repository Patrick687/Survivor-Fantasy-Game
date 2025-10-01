import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserDomain } from 'src/user/user.domain';
import { LeagueMemberRepository } from './league-member.repository';
import { League, LeagueMemberRole, Prisma } from '@prisma/client';
import { LeagueMemberRoleEntity } from './entities/league-member-role.enum';
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
      role: this.mapPrismaRoleToEntityRole(member.role),
    };
  }

  async getAllMembersForUser(
    userId: UserDomain['userId'],
  ): Promise<LeagueMemberEntity[]> {
    const leagueMemberData =
      await this.leagueMemberRepository.getMembersByUserId(userId);
    return leagueMemberData.map((member) => ({
      ...member,
      role: this.mapPrismaRoleToEntityRole(member.role),
    }));
  }

  private mapPrismaRoleToEntityRole(
    role: LeagueMemberRole,
  ): LeagueMemberRoleEntity {
    switch (role) {
      case LeagueMemberRole.ADMIN:
        return LeagueMemberRoleEntity.ADMIN;
      case LeagueMemberRole.MEMBER:
        return LeagueMemberRoleEntity.MEMBER;
      case LeagueMemberRole.OWNER:
        return LeagueMemberRoleEntity.OWNER;
      default:
        throw new InternalServerErrorException(`Unknown role: ${role}`);
    }
  }
}
