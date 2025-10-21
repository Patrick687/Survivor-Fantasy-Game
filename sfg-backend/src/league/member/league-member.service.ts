import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LeagueMemberRepository } from './league-member.repository';
import { League, LeagueMemberRole, Prisma } from '@prisma/client';
import { LeagueMemberEntity } from './entities/league-member.entity';
import { User } from 'src/user/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@Injectable()
export class LeagueMemberService {
  constructor(
    private readonly leagueMemberRepository: LeagueMemberRepository,
  ) {}

  async getUserLeagueMembership(
    userId: string,
    leagueId: string,
  ): Promise<{ leagueId: string; role: LeagueMemberRole } | null> {
    const member = await this.leagueMemberRepository.findUnique({
      where: {
        leagueId_userId: {
          userId,
          leagueId,
        },
      },
    });

    if (!member) {
      return null;
    }

    return {
      leagueId: member.leagueId,
      role: member.role,
    };
  }

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
    userId: User['userId'],
  ): Promise<LeagueMemberEntity[]> {
    const leagueMemberData =
      await this.leagueMemberRepository.getMembersByUserId(userId);
    return leagueMemberData.map((member) => ({
      ...member,
    }));
  }

  async updateMemberRole(
    requesterUserId: string,
    input: UpdateMemberRoleDto,
    requesterRole: LeagueMemberRole,
  ): Promise<LeagueMemberEntity> {
    const { leagueId, targetUserId, newRole } = input;

    const targetMember = await this.leagueMemberRepository.findByUserAndLeague(
      targetUserId,
      leagueId,
    );

    if (!targetMember) {
      throw new NotFoundException('Target user is not a member of the league');
    }

    const requesterMember =
      await this.leagueMemberRepository.findByUserAndLeague(
        requesterUserId,
        leagueId,
      );

    if (!requesterMember) {
      throw new ForbiddenException('You are not a member of this league');
    }

    this.validateRoleUpdate(requesterMember, targetMember, newRole);

    const updatedMember = await this.leagueMemberRepository.updateRole(
      targetMember.id,
      newRole,
    );

    return updatedMember;
  }

  private validateRoleUpdate(
    requester: LeagueMemberEntity,
    target: LeagueMemberEntity,
    newRole: LeagueMemberRole,
  ) {
    // Owner cannot change their own role
    if (
      requester.id === target.id &&
      requester.role === LeagueMemberRole.OWNER
    ) {
      throw new BadRequestException('Owner cannot change their own role');
    }

    // Only owners can promote/demote
    if (requester.role !== LeagueMemberRole.OWNER) {
      // Admins can only promote members to admin (not demote other admins)
      if (requester.role === LeagueMemberRole.ADMIN) {
        if (
          target.role === LeagueMemberRole.ADMIN &&
          newRole === LeagueMemberRole.MEMBER
        ) {
          throw new ForbiddenException('Admins cannot demote other admins');
        }
        if (newRole === LeagueMemberRole.OWNER) {
          throw new ForbiddenException('Only owners can assign owner role');
        }
      } else {
        throw new ForbiddenException(
          'Only owners and admins can change member roles',
        );
      }
    }

    // Cannot promote to owner (only one owner allowed - would need transfer ownership)
    if (newRole === LeagueMemberRole.OWNER) {
      throw new BadRequestException(
        'Cannot promote to owner. Use transfer ownership instead.',
      );
    }

    // Validate role transition
    if (target.role === newRole) {
      throw new BadRequestException('User already has this role');
    }
  }
}
