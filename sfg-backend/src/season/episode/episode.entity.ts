import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Episode {
  @Field(() => Int!, { nullable: false })
  episodeNumber: number;

  @Field(() => String!, { nullable: false })
  title: string;

  @Field(() => Date!, { nullable: false })
  airDate: Date;

  seasonId: number;
}
