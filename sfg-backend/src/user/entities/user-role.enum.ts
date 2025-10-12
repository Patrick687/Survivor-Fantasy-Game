import { registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'The role of the user in the system',
  valuesMap: {
    USER: {
      description: 'Regular user with standard permissions',
    },
    ADMIN: {
      description: 'Administrator with elevated system permissions',
    },
  },
});

export { UserRole };
