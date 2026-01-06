import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LeagueMember as LeagueMemberModel, LeagueRole } from '@prisma/client';

@ObjectType()
export class LeagueMember implements LeagueMemberModel {
  @Field(() => String, { nullable: false })
  id: LeagueMemberModel['id'];

  leagueId: LeagueMemberModel['leagueId'];

  userId: LeagueMemberModel['userId'];

  inviteCodeId: LeagueMemberModel['inviteCodeId'];

  @Field(() => Date, { nullable: false })
  joinedAt: LeagueMemberModel['joinedAt'];

  @Field(() => LeagueRole, { nullable: false })
  role: LeagueMemberModel['role'];
}

registerEnumType(LeagueRole, {
  name: 'LeagueRole',
  description: 'Roles assigned to league members',
});
