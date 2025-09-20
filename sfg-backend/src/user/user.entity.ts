import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field(() => ID!)
    id: string;

    @Field(() => String!)
    username: string;

    @Field(() => String!)
    email: string;

}