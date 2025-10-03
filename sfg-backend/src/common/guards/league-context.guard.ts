// src/common/guards/league-context.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from '../../auth/token/jwt-payload.type';

@Injectable()
export class LeagueContextGuard implements CanActivate {
  private readonly logger = new Logger(LeagueContextGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const args = gqlContext.getArgs();
    const request = gqlContext.getContext().req;
    const user: JwtPayload = request.user;

    this.logger.debug(`🔍 LeagueContextGuard - User: ${user?.userId}`);
    this.logger.debug(
      `🔍 LeagueContextGuard - Args:`,
      JSON.stringify(args, null, 2),
    );

    // Extract leagueId from arguments
    const leagueId = this.extractLeagueId(args);
    this.logger.debug(
      `🔍 LeagueContextGuard - Extracted leagueId: ${leagueId}`,
    );

    if (!leagueId) {
      this.logger.error(`❌ LeagueContextGuard - No leagueId found in args`);
      throw new ForbiddenException('League ID is required');
    }

    if (!user.leagues) {
      this.logger.error(`❌ LeagueContextGuard - User has no leagues in JWT`);
      throw new ForbiddenException('No league memberships found in token');
    }

    // Find user's membership in this league from JWT
    const leagueMembership = user.leagues.find(
      (league) => league.leagueId === leagueId,
    );
    this.logger.debug(
      `🔍 LeagueContextGuard - Found membership:`,
      JSON.stringify(leagueMembership, null, 2),
    );

    if (!leagueMembership) {
      this.logger.error(
        `❌ LeagueContextGuard - User not member of league ${leagueId}`,
      );
      throw new ForbiddenException('You are not a member of this league');
    }

    // ⭐ THIS IS THE KEY PART - Set the league context
    request.currentLeague = leagueMembership;
    this.logger.debug(
      `✅ LeagueContextGuard - League context set:`,
      JSON.stringify(leagueMembership, null, 2),
    );

    return true;
  }

  private extractLeagueId(args: any): string | null {
    // Direct leagueId argument
    if (args.leagueId) return args.leagueId;

    // LeagueId in input object
    if (args.input?.leagueId) return args.input.leagueId;

    return null;
  }
}
