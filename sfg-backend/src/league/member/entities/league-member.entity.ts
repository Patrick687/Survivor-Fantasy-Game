import { Field, ObjectType } from '@nestjs/graphql';
import { LeagueEntity } from 'src/league/league.entity';
import { UserDomain } from 'src/user/user.domain';
import { LeagueMemberRoleEntity } from './league-member-role.enum';

@ObjectType()
export class LeagueMemberEntity {
  @Field(() => String!, { nullable: false })
  id: string;

  @Field(() => LeagueMemberRoleEntity, { nullable: false })
  role: LeagueMemberRoleEntity;

  userId: UserDomain['userId'];

  leagueId: LeagueEntity['leagueId'];
}
