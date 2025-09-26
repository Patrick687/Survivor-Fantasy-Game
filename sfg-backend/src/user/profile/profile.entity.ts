import { Field, ObjectType } from '@nestjs/graphql';
import { Profile as ProfilePrisma, User as UserPrisma } from '@prisma/client';

@ObjectType()
export class Profile {
  userId: UserPrisma['userId'];

  @Field(() => String!)
  id: ProfilePrisma['id'];

  @Field(() => String!)
  firstName: ProfilePrisma['firstName'];

  @Field(() => String, { nullable: true })
  lastName: ProfilePrisma['lastName'];

  @Field(() => Boolean!)
  isPublic: ProfilePrisma['isPublic'];

  @Field(() => String!)
  userName: ProfilePrisma['userName'];
}
