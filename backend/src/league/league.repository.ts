import { Injectable } from '@nestjs/common';
import { League, LeagueMember, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/common/repository/base.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeagueRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async findByUnique(
    args: Prisma.LeagueFindUniqueArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<League | null> {
    return await this.getPrismaClient(tx).league.findUnique(args);
  }

  async findLeagueByLeagueMemberId(
    leagueMemberId: LeagueMember['id'],
    tx?: Prisma.TransactionClient,
  ): Promise<League | null> {
    const leagueMember = await this.getPrismaClient(tx).leagueMember.findUnique(
      {
        where: { id: leagueMemberId },
        include: { league: true },
      },
    );
    return leagueMember?.league ?? null;
  }

  async findLeaguesByUserId(
    userId: LeagueMember['userId'],
    tx?: Prisma.TransactionClient,
  ): Promise<League[]> {
    return await this.getPrismaClient(tx).league.findMany({
      where: {
        leagueMembers: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async createLeague(
    args: Prisma.LeagueUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<League> {
    return await this.getPrismaClient(tx).league.create({
      data: args,
    });
  }
}
