import { Field, ID, ObjectType } from '@nestjs/graphql';
import { LeagueInviteToken } from '@prisma/client';

@ObjectType()
export class LeagueInviteTokenEntity {
  @Field(() => ID!, { nullable: false })
  id: LeagueInviteToken['id'];

  @Field(() => String!, { nullable: false })
  token: LeagueInviteToken['token'];

  @Field(() => Date!, { nullable: false })
  expiresAt: LeagueInviteToken['expiresAt'];

  @Field(() => Number!, { nullable: false })
  usedCount: LeagueInviteToken['usedCount'];

  @Field(() => Date!, { nullable: false })
  createdAt: Date;

  leagueId: string;
  createdBy: string;
}
