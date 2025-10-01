import { ObjectType, Field, ID, ResolveField } from '@nestjs/graphql';
import { UserRole } from './user-role.enum';
import { Profile } from '../profile/profile.entity';

@ObjectType()
export class User {
  @Field(() => ID!)
  userId: string;

  @Field(() => String!)
  email: string;

  @Field(() => UserRole!)
  role: UserRole;
}
