import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PASSWORD_LOWERCASE_PATTERN, PASSWORD_MIN_LENGTH, PASSWORD_SPECIAL_PATTERN, PASSWORD_UPPERCASE_PATTERN, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_PATTERN } from 'src/common/validation.constants';

@InputType()
export class RegisterDto {
    @Field()
    @IsString({
        message: 'Username must be a string',
    })
    @IsNotEmpty({
        message: 'Username is required',
    })
    @MinLength(USERNAME_MIN_LENGTH, {
        message: `Username must be at least ${USERNAME_MIN_LENGTH} characters long`,
    })
    @MaxLength(USERNAME_MAX_LENGTH, {
        message: `Username can only be up to ${USERNAME_MAX_LENGTH} characters long`,
    })
    @Matches(USERNAME_PATTERN, {
        message: 'Username can only contain letters, numbers, and underscores',
    })
    username: string;

    @Field()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Field()
    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH, {
        message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`
    }
    )
    @MaxLength(50, {
        message: 'Password can only be up to 50 characters long',
    })
    @Matches(PASSWORD_LOWERCASE_PATTERN, {
        message: 'Password must contain at least one lowercase letter',
    })
    @Matches(PASSWORD_UPPERCASE_PATTERN, {
        message: 'Password must contain at least one uppercase letter',
    })
    @Matches(PASSWORD_SPECIAL_PATTERN, {
        message: 'Password must contain at least one special character',
    })
    password: string;
}