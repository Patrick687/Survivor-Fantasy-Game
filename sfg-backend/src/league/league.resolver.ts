import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { LeagueEntity } from './league.entity';
import { LeagueService } from './league.service';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/token/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { type JwtPayload } from '../auth/token/jwt-payload.type';
import { SeasonService } from 'src/season/season.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LeagueMemberService } from './member/league-member.service';
import { SeasonEntity } from 'src/season/season.entity';
import { LeagueMemberEntity } from './member/entities/league-member.entity';
import { CreateLeagueDto } from './dto/create-league.dto';

@Resolver(() => LeagueEntity)
export class LeagueResolver {
  private logger = new Logger(LeagueResolver.name);

  constructor(
    private readonly leagueService: LeagueService,
    private readonly leagueMemberService: LeagueMemberService,
    private readonly seasonService: SeasonService,
    private readonly userService: UserService,
  ) {}

  @Query(() => [LeagueEntity!]!, { name: 'getMyLeagues', nullable: false })
  @UseGuards(JwtAuthGuard)
  async getMyLeagues(@CurrentUser() user: JwtPayload): Promise<LeagueEntity[]> {
    this.logger.debug(`✉️ getMyLeagues called for userId: ${user.userId}`);
    const leagueMembers = await this.leagueMemberService.getAllMembersForUser(
      user.userId,
    );
    const leagues: LeagueEntity[] = [];

    for (const member of leagueMembers) {
      this.logger.debug(
        `🏅 User is member of leagueId: ${member.leagueId} with role: ${member.role}`,
      );
      const league = await this.leagueService.getLeagueById(member.leagueId);
      leagues.push(league);
    }

    this.logger.debug(`📨 getMyLeagues returning ${leagues.length} leagues`);
    return leagues;
  }

  @Mutation(() => LeagueEntity!, { nullable: false, name: 'createLeague' })
  @UseGuards(JwtAuthGuard)
  async createLeague(
    @CurrentUser() user: JwtPayload,
    @Args('input') input: CreateLeagueDto,
  ): Promise<LeagueEntity> {
    this.logger.debug(`✉️ createLeague called by userId: ${user.userId}`);
    const league = await this.leagueService.createLeague(input, user.userId);
    this.logger.debug(
      `🏆 League created with leagueId: ${league.leagueId} by userId: ${user.userId}`,
    );
    return league;
  }

  @ResolveField(() => SeasonEntity, { name: 'season', nullable: false })
  async season(@Parent() league: LeagueEntity): Promise<SeasonEntity> {
    this.logger.debug(
      `✉️ Resolving season ${league.seasonId} for leagueId: ${league.leagueId}`,
    );

    const seasonDomain = await this.seasonService.getSeasonById(
      league.seasonId,
    );

    return seasonDomain;
  }

  @ResolveField(() => LeagueMemberEntity, {
    name: 'createdBy',
    nullable: false,
  })
  async createdBy(@Parent() league: LeagueEntity): Promise<LeagueMemberEntity> {
    this.logger.debug(
      `✉️ Resolving createdBy ${league.createdBy} for leagueId: ${league.leagueId}`,
    );
    return await this.leagueMemberService.getLeagueMember(
      league.createdBy,
      league.leagueId,
    );
  }

  @ResolveField(() => [LeagueMemberEntity!]!, {
    name: 'members',
    nullable: false,
  })
  async members(@Parent() league: LeagueEntity): Promise<LeagueMemberEntity[]> {
    this.logger.debug(`✉️ Resolving members for leagueId: ${league.leagueId}`);
    return await this.leagueMemberService.getAllMembersForLeague(
      league.leagueId,
    );
  }
}
