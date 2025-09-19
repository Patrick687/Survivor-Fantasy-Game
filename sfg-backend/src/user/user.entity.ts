import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
    @Field(() => String, { nullable: false })
    id: string;

    @Field(() => String, { nullable: false })
    username: string;

    @Field(() => String, { nullable: false })
    email: string;
}