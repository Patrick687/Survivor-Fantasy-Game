import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class VerifySessionInput {
  @Field({ nullable: false })
  @IsNotEmpty({ message: 'Token is required.' })
  token: string;
}
