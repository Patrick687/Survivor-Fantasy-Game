import { registerEnumType } from '@nestjs/graphql';
import { LeagueMemberRole } from '@prisma/client';

registerEnumType(LeagueMemberRole, {
  name: 'LeagueMemberRole',
  description: 'The role of a member in a league',
  valuesMap: {
    OWNER: {
      description: 'Owner of the league with full permissions',
    },
    ADMIN: {
      description: 'Administrator with management permissions',
    },
    MEMBER: {
      description: 'Regular league member',
    },
  },
});

export { LeagueMemberRole };
