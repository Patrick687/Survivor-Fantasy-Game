import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { LeagueInviteCode } from './league-invite-code.entity';
import { LeagueInviteCodeService } from './league-invite-code.service';
import { League } from 'src/league/league.entity';
import { LeagueService } from 'src/league/league.service';
import { LeagueMember } from '../league-member.entity';
import { type AuthContext } from 'src/auth/auth.guard';
import { CreateLeagueInviteCodeInput } from './dto/create-league-invite-code.dto';

@Resolver(() => LeagueInviteCode)
export class LeagueInviteCodeResolver {
  constructor(
    private readonly leagueInviteCodeService: LeagueInviteCodeService,
    private readonly leagueService: LeagueService,
  ) {}

  @Mutation(() => LeagueInviteCode, {
    name: 'createLeagueInviteCode',
    nullable: false,
  })
  async createLeagueInviteCode(
    @Context() context: AuthContext,
    @Args('input') input: CreateLeagueInviteCodeInput,
  ): Promise<LeagueInviteCode> {
    const userId = context.req.user.sub;
    return await this.leagueInviteCodeService.createInviteCode(
      input.leagueId,
      userId,
    );
  }

  @Mutation(() => League, {
    name: 'useLeagueInviteCode',
    nullable: false,
  })
  async useLeagueInviteCode(
    @Context() context: AuthContext,
    @Args('inviteCode') inviteCode: string,
  ): Promise<League> {
    const userId = context.req.user.sub;
    return await this.leagueInviteCodeService.useInviteCode(inviteCode, userId);
  }

  @ResolveField(() => League, { name: 'league', nullable: false })
  async league(@Parent() inviteCode: LeagueInviteCode): Promise<League> {
    return this.leagueService.getLeagueById(inviteCode.leagueId);
  }

  @ResolveField(() => LeagueMember, { name: 'createdBy', nullable: false })
  async createdBy(
    @Parent() inviteCode: LeagueInviteCode,
  ): Promise<LeagueMember> {
    return this.leagueInviteCodeService.getInviteCodeCreator(
      inviteCode.createdById,
      inviteCode.leagueId,
    );
  }
}
