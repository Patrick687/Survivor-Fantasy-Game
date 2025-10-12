import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserRole } from './user-role.enum';

@ObjectType()
export class User {
  @Field(() => ID!)
  userId: string;

  @Field(() => String!)
  email: string;

  @Field(() => UserRole!)
  role: UserRole;
}
