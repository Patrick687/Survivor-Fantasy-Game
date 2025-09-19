import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { LeagueService } from "./league.service";
import { League, LeagueInvite, LeagueMember } from "src/graphql/graphql";
import { GetLeagueDto } from "./dto/getLeague.dto";
import { CreateLeagueDto } from "./dto/createLeague.dto";
import { LeagueMemberService } from "./member/leagueMember.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard, type UserContext } from "src/auth/auth.guard";

@Resolver(() => League)
export class LeagueResolver {
    constructor(private readonly leagueService: LeagueService, private readonly leagueMemberService: LeagueMemberService) { }

    @Query(() => League)
    @UseGuards(AuthGuard)
    async getLeague(@Args() args: GetLeagueDto, @Context() context: UserContext): Promise<League> {
        const userId = context.req.payload.userId;
        return this.leagueService.getLeagueById(args.id, userId) as unknown as League;
    }

    @Query(() => [League])
    @UseGuards(AuthGuard)
    async getUserLeagues(@Context() context: UserContext): Promise<League[]> {
        const userId = context.req.payload.userId;
        const leaguesData = await this.leagueService.getUserLeagues(userId);
        return leaguesData as unknown as League[];
    }

    @Mutation(() => League, { name: 'createLeague' })
    @UseGuards(AuthGuard)
    async createLeague(@Args('body') body: CreateLeagueDto, @Context() context: UserContext): Promise<League> {
        const userId = context.req.payload.userId;
        const leagueData = await this.leagueService.createLeague(body, userId);
        return leagueData as unknown as League;
    }

    @ResolveField(() => [LeagueMember], { name: 'leagueMembers' })
    async leagueMembers(@Parent() league: League): Promise<LeagueMember[]> {
        const leagueMembers = await this.leagueMemberService.getLeagueMembersByLeagueId(league.id);
        return leagueMembers as unknown as LeagueMember[];
    }

    @ResolveField(() => LeagueMember, { name: 'leagueOwner' })
    async leagueOwner(@Parent() league: League): Promise<LeagueMember> {
        const leagueOwner = await this.leagueMemberService.getLeagueOwnerByLeagueId(league.id);
        return leagueOwner as unknown as LeagueMember;
    }

    @ResolveField(() => [LeagueMember], { name: 'leagueAdmins' })
    async leagueAdmins(@Parent() league: League): Promise<LeagueMember[]> {
        const leagueAdmins = await this.leagueMemberService.getLeagueAdminsByLeagueId(league.id);
        return leagueAdmins as unknown as LeagueMember[];
    }
}