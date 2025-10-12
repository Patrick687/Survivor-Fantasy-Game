import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Season, User } from '@prisma/client';

@ObjectType()
export class LeagueEntity {
  @Field(() => ID!, { nullable: false })
  leagueId: string;

  @Field(() => String!, { nullable: false })
  leagueName: string;

  @Field(() => Date!, { nullable: false })
  createdAt: Date;

  seasonId: Season['seasonId'];
  createdBy: User['userId'];
}
