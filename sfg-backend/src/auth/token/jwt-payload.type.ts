import { LeagueMemberRole } from '@prisma/client';
import { UserRole } from 'src/user/entities/user-role.enum';

export type JwtPayload = {
  userId: string;
  userRole: UserRole;
  leagues: Array<{
    leagueId: string;
    role: LeagueMemberRole;
  }>;
};
