import { InputType, Field } from '@nestjs/graphql';
import {
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Transform } from 'class-transformer';

@ValidatorConstraint({ name: 'UserNameOrEmail', async: false })
class UserNameOrEmailConstraint implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments) {
    if (!value) return false;
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      return true; // Valid email
    }
    // Username: at least 7 chars, not an email
    return value.length >= 7;
  }
  defaultMessage(args: ValidationArguments) {
    const value = args.value;
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      return 'userNameOrEmail must be a valid email address or a username with at least 7 characters.';
    }
    if (typeof value === 'string' && value.length < 7) {
      return 'Username must be at least 7 characters long.';
    }
    return 'userNameOrEmail must be a valid email address or a username with at least 7 characters.';
  }
}

@InputType()
export class LoginDto {
  @Field()
  @Validate(UserNameOrEmailConstraint)
  @Transform(({ value }) => value?.toLowerCase())
  userNameOrEmail: string;

  @Field()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;
}
