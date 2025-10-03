import { Injectable, NotFoundException } from '@nestjs/common';
import { LeagueInviteToken, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeagueInviteTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.LeagueInviteTokenCreateInput,
  ): Promise<LeagueInviteToken> {
    return await this.prisma.leagueInviteToken.create({ data });
  }

  async findValidToken(
    token: LeagueInviteToken['token'],
  ): Promise<LeagueInviteToken | null> {
    return await this.prisma.leagueInviteToken.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  async incrementUsage(
    tokenId: LeagueInviteToken['id'],
  ): Promise<LeagueInviteToken> {
    const existingToken = await this.prisma.leagueInviteToken.findUnique({
      where: { id: tokenId },
    });
    //Check to make sure token is not expired
    if (!existingToken) {
      throw new NotFoundException(`Token with id ${tokenId} does not exist`);
    }
    if (existingToken.expiresAt < new Date()) {
      throw new NotFoundException(`Token with id ${tokenId} is expired`);
    }

    return this.prisma.leagueInviteToken.update({
      where: { id: tokenId },
      data: { usedCount: { increment: 1 } },
    });
  }
}
