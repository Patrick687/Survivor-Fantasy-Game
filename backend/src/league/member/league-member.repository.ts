import { Injectable } from '@nestjs/common';
import { LeagueMember, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/common/repository/base.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeagueMemberRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async createLeagueMember(
    leagueMemberCreateArgs: Prisma.LeagueMemberUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<LeagueMember> {
    return await this.getPrismaClient(tx).leagueMember.create({
      data: leagueMemberCreateArgs,
    });
  }

  async findLeagueMembersByLeagueId(
    leagueId: LeagueMember['leagueId'],
    tx?: Prisma.TransactionClient,
  ): Promise<LeagueMember[]> {
    return await this.getPrismaClient(tx).leagueMember.findMany({
      where: {
        leagueId,
      },
    });
  }

  async findLeagueMemberByUnique(
    where: Prisma.LeagueMemberFindUniqueArgs['where'],
    tx?: Prisma.TransactionClient,
  ) {
    return await this.getPrismaClient(tx).leagueMember.findUnique({
      where,
    });
  }
}
