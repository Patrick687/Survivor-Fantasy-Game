import { ObjectType, Field } from '@nestjs/graphql';
@ObjectType()
export class AuthSession {
  @Field(() => String, { nullable: false })
  token: string;

  @Field(() => Date, { nullable: false })
  expiresAt: Date;
}
