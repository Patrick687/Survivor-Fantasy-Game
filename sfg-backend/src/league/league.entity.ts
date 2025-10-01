import { ObjectType, Field, ID } from '@nestjs/graphql';
import { SeasonEntity } from 'src/season/season.entity';
import { UserDomain } from 'src/user/user.domain';

@ObjectType()
export class LeagueEntity {
  @Field(() => ID!, { nullable: false })
  leagueId: string;

  @Field(() => String!, { nullable: false })
  leagueName: string;

  @Field(() => Date!, { nullable: false })
  createdAt: Date;

  seasonId: SeasonEntity['seasonId'];
  createdBy: UserDomain['userId'];
}
