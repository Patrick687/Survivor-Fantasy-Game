// src/common/decorators/league-roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { LeagueMemberRole } from '@prisma/client';
import { LEAGUE_ROLES_KEY } from '../guards/league-role.guard';

export const RequireLeagueRoles = (...roles: LeagueMemberRole[]) =>
  SetMetadata(LEAGUE_ROLES_KEY, roles);
