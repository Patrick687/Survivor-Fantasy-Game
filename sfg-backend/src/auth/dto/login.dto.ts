import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginDto {
    @Field()
    @IsString({ message: 'Username or email must be a string' })
    @IsNotEmpty({ message: 'Username or email is required' })
    usernameOrEmail: string;

    @Field()
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}