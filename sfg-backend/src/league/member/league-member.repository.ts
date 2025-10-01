import { Injectable } from '@nestjs/common';
import { LeagueMember, Prisma } from '@prisma/client';
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
}
