import { Injectable } from '@nestjs/common';
import { League, LeagueMember, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeagueRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findLeaguesByUserId(
    userId: string,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<LeagueMember[]> {
    const leagueMembers = await prismaClient.leagueMember.findMany({
      where: { userId },
    });
    return leagueMembers;
  }

  async findLeagueById(
    leagueId: League['leagueId'],
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<League | null> {
    return await prismaClient.league.findFirst({
      where: { leagueId },
    });
  }

  async createLeague(
    data: Prisma.LeagueUncheckedCreateInput,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<League> {
    return await prismaClient.league.create({
      data,
    });
  }
}
