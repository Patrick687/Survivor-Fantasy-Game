import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LeagueEntity } from 'src/league/league.entity';
import { LeagueService } from 'src/league/league.service';
import { LeagueMemberEntity } from './entities/league-member.entity';

@Resolver(() => LeagueMemberEntity)
export class LeagueMemberResolver {
  constructor(
    private readonly userService: UserService,
    private readonly leagueService: LeagueService,
  ) {}

  @ResolveField(() => User, { name: 'user', nullable: false })
  async user(@Parent() leagueMember: LeagueMemberEntity): Promise<User> {
    return await this.userService.getUser({
      userId: leagueMember.userId,
    });
  }

  @ResolveField(() => LeagueEntity, { name: 'league', nullable: false })
  async league(
    @Parent() leagueMember: LeagueMemberEntity,
  ): Promise<LeagueEntity> {
    return await this.leagueService.getLeagueById(leagueMember.leagueId);
  }
}
