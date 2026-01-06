import { Field, ObjectType } from '@nestjs/graphql';
import { LeagueInviteCode as LeagueInviteCodeModel } from '@prisma/client';

@ObjectType()
export class LeagueInviteCode implements LeagueInviteCodeModel {
  @Field(() => String, { nullable: false })
  id: LeagueInviteCodeModel['id'];

  @Field(() => String, { nullable: false })
  code: LeagueInviteCodeModel['code'];

  leagueId: LeagueInviteCodeModel['leagueId'];

  @Field(() => Date, { nullable: false })
  createdAt: LeagueInviteCodeModel['createdAt'];

  @Field(() => Date, { nullable: false })
  expiresAt: LeagueInviteCodeModel['expiresAt'];

  @Field(() => Date, { nullable: true })
  revokedAt: LeagueInviteCodeModel['revokedAt'];

  createdById: LeagueInviteCodeModel['createdById'];
}
