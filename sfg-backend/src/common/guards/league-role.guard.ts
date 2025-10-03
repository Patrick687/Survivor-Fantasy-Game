// src/common/guards/league-role.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { LeagueMemberRole } from '@prisma/client';

export const LEAGUE_ROLES_KEY = 'leagueRoles';

@Injectable()
export class LeagueRoleGuard implements CanActivate {
  private readonly logger = new Logger(LeagueRoleGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<LeagueMemberRole[]>(
      LEAGUE_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    this.logger.debug(`🔍 LeagueRoleGuard - Required roles:`, requiredRoles);

    if (!requiredRoles) {
      this.logger.debug(
        `✅ LeagueRoleGuard - No specific roles required, allowing access`,
      );
      return true; // No specific roles required
    }

    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;
    const currentLeague = request.currentLeague;

    this.logger.debug(
      `🔍 LeagueRoleGuard - Current league context:`,
      JSON.stringify(currentLeague, null, 2),
    );

    if (!currentLeague) {
      this.logger.error(`❌ LeagueRoleGuard - League context not found`);
      throw new ForbiddenException('League context not found');
    }

    if (!requiredRoles.includes(currentLeague.role)) {
      this.logger.error(
        `❌ LeagueRoleGuard - Insufficient permissions. Required: ${requiredRoles.join(', ')}, Current: ${currentLeague.role}`,
      );
      throw new ForbiddenException(
        `Insufficient permissions. Required: ${requiredRoles.join(', ')}, Current: ${currentLeague.role}`,
      );
    }

    this.logger.debug(`✅ LeagueRoleGuard - Role check passed`);
    return true;
  }
}
