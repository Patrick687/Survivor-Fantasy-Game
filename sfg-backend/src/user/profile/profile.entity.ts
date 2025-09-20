import { Field, ObjectType } from "@nestjs/graphql";
import { Profile as ProfilePrisma } from "@prisma/client";

@ObjectType()
export class Profile {
    id: ProfilePrisma['id'];

    @Field(() => String!)
    firstName: ProfilePrisma['firstName'];

    @Field(() => String, { nullable: true })
    lastName: ProfilePrisma['lastName'];

    @Field(() => Boolean!)
    isPublic: ProfilePrisma['isPublic'];

}