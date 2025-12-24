import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import { User as PrismaUser } from '@prisma/client';

@ObjectType()
export class User {
  @Field(() => GraphQLUUID, { nullable: false })
  userId: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  userName: string;

  static mapToEntity(user: PrismaUser): User {
    const userEntity = new User();
    userEntity.userId = user.id;
    userEntity.firstName = user.firstName || undefined;
    userEntity.lastName = user.lastName || undefined;
    userEntity.email = user.email;
    userEntity.userName = user.userName;
    return userEntity;
  }
}
