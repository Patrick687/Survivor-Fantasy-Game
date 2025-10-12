import { Field, ObjectType } from '@nestjs/graphql';
import { LeagueMemberRole, User } from '@prisma/client';
import { LeagueEntity } from 'src/league/league.entity';

@ObjectType()
export class LeagueMemberEntity {
  @Field(() => String!, { nullable: false })
  id: string;

  @Field(() => LeagueMemberRole, { nullable: false })
  role: LeagueMemberRole;

  userId: User['userId'];

  leagueId: LeagueEntity['leagueId'];
}
