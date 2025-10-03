import { Field, ObjectType } from '@nestjs/graphql';
import { LeagueMemberRole } from '@prisma/client';
import { LeagueEntity } from 'src/league/league.entity';
import { UserDomain } from 'src/user/user.domain';

@ObjectType()
export class LeagueMemberEntity {
  @Field(() => String!, { nullable: false })
  id: string;

  @Field(() => LeagueMemberRole, { nullable: false })
  role: LeagueMemberRole;

  userId: UserDomain['userId'];

  leagueId: LeagueEntity['leagueId'];
}
