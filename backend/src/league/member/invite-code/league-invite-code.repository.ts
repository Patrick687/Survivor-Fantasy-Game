import { Injectable } from '@nestjs/common';
import { LeagueInviteCode, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/common/repository/base.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeagueInviteCodeRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async existsByCode(code: string): Promise<boolean> {
    const count = await this.prismaService.leagueInviteCode.count({
      where: { code },
    });
    return count > 0;
  }

  async getByCode(
    code: string,
    tx?: Prisma.TransactionClient,
  ): Promise<LeagueInviteCode | null> {
    return await this.getPrismaClient(tx).leagueInviteCode.findUnique({
      where: { code },
    });
  }

  async createInviteCode(
    data: Prisma.LeagueInviteCodeUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<LeagueInviteCode> {
    if (tx) {
      await tx.leagueInviteCode.deleteMany({
        where: {
          leagueId: data.leagueId,
          createdById: data.createdById,
        },
      });

      return await tx.leagueInviteCode.create({
        data,
      });
    } else {
      const inviteCode = await this.prismaService.$transaction(async (tx1) => {
        await tx1.leagueInviteCode.deleteMany({
          where: {
            leagueId: data.leagueId,
            createdById: data.createdById,
          },
        });

        return await tx1.leagueInviteCode.create({
          data,
        });
      });
      return inviteCode;
    }
  }
}
