import { registerEnumType } from '@nestjs/graphql';

export enum LeagueMemberRoleEntity {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  OWNER = 'OWNER',
}

registerEnumType(LeagueMemberRoleEntity, {
  name: 'LeagueMemberRole',
  description: 'The role of a member within a league',
});
