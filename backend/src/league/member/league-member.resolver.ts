import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { LeagueMember } from './league-member.entity';
import { League } from '../league.entity';
import { User } from 'src/user/user.entity';
import { LeagueService } from '../league.service';
import { UserService } from 'src/user/user.service';

@Resolver(() => LeagueMember)
export class LeagueMemberResolver {
  constructor(
    private readonly leagueService: LeagueService,
    private readonly userService: UserService,
  ) {}

  @ResolveField(() => League, { name: 'league', nullable: false })
  async league(@Parent() member: LeagueMember): Promise<League> {
    return await this.leagueService.getLeagueByLeagueMemberId(member.id);
  }

  @ResolveField(() => User, { name: 'user', nullable: false })
  async user(@Parent() member: LeagueMember): Promise<User> {
    const userId = member.userId;
    return await this.userService.getUser({
      id: userId,
    });
  }

  @ResolveField(() => LeagueMember, { name: 'invitedBy', nullable: true })
  async invitedBy(@Parent() member: LeagueMember): Promise<User | null> {
    return null;
  }
}
