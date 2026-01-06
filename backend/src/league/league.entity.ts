import { Field, ObjectType } from '@nestjs/graphql';
import { League as LeagueModel } from '@prisma/client';

@ObjectType()
export class League implements LeagueModel {
  @Field(() => String, { nullable: false })
  id: LeagueModel['id'];

  seasonId: LeagueModel['seasonId'];

  @Field(() => String, { nullable: false })
  name: LeagueModel['name'];

  @Field(() => String, { nullable: true })
  description: LeagueModel['description'];

  @Field(() => Date, { nullable: false })
  createdAt: LeagueModel['createdAt'];

  createdById: LeagueModel['createdById'];

  @Field(() => Date, { nullable: true })
  updatedAt: LeagueModel['updatedAt'];

  updatedById: LeagueModel['updatedById'];
}
