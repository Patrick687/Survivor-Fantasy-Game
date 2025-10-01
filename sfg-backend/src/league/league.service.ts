import { Injectable, NotFoundException } from '@nestjs/common';
import { League, User } from '@prisma/client';
import { LeagueEntity } from './league.entity';
import { LeagueRepository } from './league.repository';
import { CreateLeagueDto } from './dto/create-league.dto';
import { LeagueMemberService } from './member/league-member.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeagueService {
  constructor(
    private readonly leagueRepository: LeagueRepository,
    private readonly leagueMemberService: LeagueMemberService,
    private readonly prismaService: PrismaService,
  ) {}

  async getLeagueById(leagueId: League['leagueId']): Promise<LeagueEntity> {
    const leagueData = await this.leagueRepository.findLeagueById(leagueId);
    if (!leagueData) {
      throw new NotFoundException(`League with ID ${leagueId} not found`);
    }
    return {
      ...leagueData,
      createdBy: leagueData.createdById,
    };
  }

  async createLeague(
    input: CreateLeagueDto,
    userId: User['userId'],
  ): Promise<LeagueEntity> {
    const createdLeagueData = await this.prismaService.$transaction(
      async (tx) => {
        // Create league
        const newLeague = await this.leagueRepository.createLeague(
          {
            seasonId: input.seasonId,
            leagueName: input.name,
            createdById: userId,
          },
          tx,
        );

        // Create league owner membership
        const leagueMember = await this.leagueMemberService.createLeagueOwner(
          {
            userId: userId,
            leagueId: newLeague.leagueId,
          },
          tx,
        );

        return {
          league: newLeague,
          member: leagueMember,
        };
      },
    );

    return {
      ...createdLeagueData.league,
      createdBy: createdLeagueData.league.createdById,
    };
  }
}
