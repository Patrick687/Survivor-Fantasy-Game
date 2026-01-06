import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { League } from './league.entity';
import { type AuthContext } from 'src/auth/auth.guard';
import { LeagueService } from './league.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateLeagueInput } from './dto/create-league.input';
import { LeagueMember } from './member/league-member.entity';
import { LeagueMemberService } from './member/league-member.service';

@Resolver(() => League)
export class LeagueResolver {
  constructor(
    private readonly leagueService: LeagueService,
    private readonly leagueMemberService: LeagueMemberService,
    private readonly userService: UserService,
  ) {}

  @Query(() => [League], { name: 'getMyLeagues', nullable: false })
  async getMyLeagues(@Context() context: AuthContext): Promise<League[]> {
    const userId = context.req.user.sub;
    return await this.leagueService.getLeaguesByUserId(userId);
  }

  @Mutation(() => League, { name: 'createLeague', nullable: false })
  async createLeague(
    @Context() context: AuthContext,
    @Args('input') input: CreateLeagueInput,
  ): Promise<League> {
    const userId = context.req.user.sub;
    return await this.leagueService.createLeague(userId, input);
  }

  @ResolveField(() => User, { name: 'createdBy', nullable: false })
  async createdBy(@Parent() league: League): Promise<User> {
    const userId = league.createdById;
    return await this.userService.getUser({
      id: userId,
    });
  }

  @ResolveField(() => Int, { name: 'season', nullable: false })
  async season(@Parent() league: League): Promise<number> {
    const seasonId = league.seasonId;
    return seasonId;
  }

  @ResolveField(() => User, { name: 'updatedBy', nullable: true })
  async updatedBy(@Parent() league: League): Promise<User | null> {
    const userId = league.updatedById;
    if (!userId) {
      return null;
    }
    return await this.userService.getUser({
      id: userId,
    });
  }

  @ResolveField(() => [LeagueMember], { nullable: false, name: 'members' })
  async members(@Parent() league: League): Promise<LeagueMember[]> {
    return await this.leagueMemberService.getLeagueMembers(league.id);
  }
}
