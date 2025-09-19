import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { League, LeagueMember, User, } from "src/graphql/graphql";
import { UserService } from "src/user/user.service";
import { LeagueService } from "../league.service";

Resolver(() => LeagueMember);
export class LeagueMemberResolver {

    constructor(private readonly userService: UserService, private readonly leagueService: LeagueService) { }

    @ResolveField(() => User, { name: 'user' })
    async user(@Parent() leagueMember: LeagueMember): Promise<User> {
        const user = await this.userService.getUser('id', leagueMember.user.id);
        return user as unknown as User;
    }

    @ResolveField(() => [League], { name: 'league' })
    async leagueAdmins(@Parent() leagueMember: LeagueMember): Promise<League> {
        const league = await this.leagueService.getLeagueById(leagueMember.league.id);
        return league as unknown as League;
    }
}