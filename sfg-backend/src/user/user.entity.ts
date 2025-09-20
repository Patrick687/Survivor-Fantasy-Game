import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field(() => ID!)
    userId: string;

    @Field(() => String!)
    email: string;
}