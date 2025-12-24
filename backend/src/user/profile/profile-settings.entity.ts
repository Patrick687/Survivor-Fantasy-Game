import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProfileSettings {
  @Field(() => Boolean, { nullable: false })
  isPublic: boolean;
}
