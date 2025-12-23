import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ServiceConnection {
  @Field()
  name: string;

  @Field({ nullable: true })
  host?: string;

  @Field({ nullable: true })
  port?: number;

  @Field()
  status: boolean;
}

@ObjectType()
export class HealthCheck {
  @Field()
  status: string;

  @Field({ nullable: true })
  timestamp?: Date;
}
