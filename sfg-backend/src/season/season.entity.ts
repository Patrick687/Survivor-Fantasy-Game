// src/season/season.entity.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SeasonEntity {
  @Field(() => Int)
  seasonId: number;

  @Field(() => String, { nullable: true })
  filmingLocation: string | null;

  @Field(() => Date, { nullable: true })
  airStartDate: Date | null;

  @Field(() => Date, { nullable: true })
  airEndDate: Date | null;
}
