import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class AuthPayload {
  @Field(() => User)
  user: User;

  @Field(() => String)
  token: string;
}
