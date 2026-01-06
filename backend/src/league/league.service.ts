import { Injectable, NotFoundException } from '@nestjs/common';
import { LeagueMember, User } from '@prisma/client';
import { League } from './league.entity';
import { LeagueRepository } from './league.repository';
import { CreateLeagueInput } from './dto/create-league.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeagueMemberService } from './member/league-member.service';

@Injectable()
export class LeagueService {
  constructor(
    private readonly leagueRepository: LeagueRepository,
    private readonly leagueMemberService: LeagueMemberService,
    private readonly prismaService: PrismaService,
  ) {}

  async getLeaguesByUserId(userId: User['id']): Promise<League[]> {
    return await this.leagueRepository.findLeaguesByUserId(userId);
  }

  async getLeagueById(leagueId: League['id']): Promise<League> {
    const league = await this.leagueRepository.findByUnique({
      where: { id: leagueId },
    });
    if (!league) {
      throw new NotFoundException(`League with ID ${leagueId} not found`);
    }
    return league;
  }

  async getLeagueByLeagueMemberId(
    leagueMemberId: LeagueMember['id'],
  ): Promise<League> {
    const league =
      await this.leagueRepository.findLeagueByLeagueMemberId(leagueMemberId);

    if (!league) {
      throw new NotFoundException(
        `League not found for LeagueMember ID: ${leagueMemberId}`,
      );
    }

    return league;
  }

  async createLeague(
    userId: User['id'],
    input: CreateLeagueInput,
  ): Promise<League> {
    const { league } = await this.prismaService.$transaction(async (tx) => {
      const league = await this.leagueRepository.createLeague(
        {
          name: input.name,
          seasonId: input.seasonId,
          createdById: userId,
          description: input.description,
        },
        tx,
      );

      const leagueMember = await this.leagueMemberService.createLeagueOwner(
        {
          userId,
          leagueId: league.id,
        },
        tx,
      );

      return {
        league,
        leagueMember,
      };
    });

    return league;
  }
}
