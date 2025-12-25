import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Trim } from 'src/common/dto/trim.decorator';

@InputType()
export class LoginInput {
  @Field({ nullable: false, name: 'userNameOrEmail' })
  @Trim()
  @IsNotEmpty({ message: 'Username or email is required.' })
  userNameOrEmail: string;

  @Field({ nullable: false, name: 'password' })
  @Trim()
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}
