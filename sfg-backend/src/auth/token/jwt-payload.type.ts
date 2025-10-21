import { UserRole } from '@prisma/client';
import { LeagueMemberRole } from '@prisma/client';

export type JwtPayload = {
  userId: string;
  userRole: UserRole;
  jti: string; // JWT ID for uniqueness,
  iat: number; // Issued at time
};
