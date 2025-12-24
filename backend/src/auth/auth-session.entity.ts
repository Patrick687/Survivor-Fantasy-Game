import { ObjectType, Field } from '@nestjs/graphql';
@ObjectType()
export class AuthSession {
  @Field()
  token: string;

  @Field(() => Date)
  expiresAt: Date;
}
