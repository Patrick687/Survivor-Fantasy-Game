import { Injectable } from '@nestjs/common';
import { LeagueMember, LeagueMemberRole, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeagueMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getMembersByUserId(
    userId: LeagueMember['userId'],
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<LeagueMember[]> {
    return await prismaClient.leagueMember.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async findUnique(params: {
    where: {
      leagueId_userId: {
        userId: string;
        leagueId: string;
      };
    };
  }) {
    return this.prisma.leagueMember.findUnique(params);
  }

  async createLeagueMember(
    userId: LeagueMember['userId'],
    leagueId: LeagueMember['leagueId'],
    role: LeagueMember['role'],
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<LeagueMember> {
    return await prismaClient.leagueMember.create({
      data: {
        userId,
        leagueId,
        role,
      },
    });
  }

  async getMembersByLeagueId(
    leagueId: LeagueMember['leagueId'],
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<LeagueMember[]> {
    return await prismaClient.leagueMember.findMany({
      where: {
        leagueId: leagueId,
      },
    });
  }

  async findByUserAndLeague(
    userId: string,
    leagueId: string,
  ): Promise<LeagueMember | null> {
    return this.prisma.leagueMember.findFirst({
      where: {
        userId: userId,
        leagueId,
      },
    });
  }

  async updateRole(
    memberId: string,
    newRole: LeagueMemberRole,
  ): Promise<LeagueMember> {
    return this.prisma.leagueMember.update({
      where: { id: memberId },
      data: { role: newRole },
    });
  }
}
