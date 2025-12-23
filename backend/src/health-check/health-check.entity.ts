import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class ServiceConnection {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  host?: string;

  @Field(() => Int, { nullable: true })
  port?: number;

  @Field(() => Boolean)
  status: boolean;
}

@ObjectType()
export class HealthCheck {
  @Field(() => String)
  status: string;

  @Field(() => Date, { nullable: true })
  timestamp?: Date;
}
