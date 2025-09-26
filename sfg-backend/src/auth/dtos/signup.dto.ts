import { InputType, Field } from '@nestjs/graphql';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export const SIGNUP_DTO_VALIDATION_ERROR_MESSAGES = {
  email: {
    isNotEmpty: 'Email is required.',
    isEmail: 'Email must be a valid email address.',
  },
  password: {
    isNotEmpty: 'Password is required.',
    minLength: 'Password must be at least 8 characters long.',
    maxLength: 'Password must be at most 28 characters long.',
    matchesNumber: 'Password must contain at least one number.',
    matchesUppercase: 'Password must contain at least one uppercase letter.',
    matchesSpecialCharacter:
      'Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)',
  },
  userName: {
    isNotEmpty: 'Username is required.',
    minLength: 'Username must be at least 6 characters long.',
    maxLength: 'Username must be at most 20 characters long.',
    isAlphanumeric: 'Username can only contain letters and numbers.',
  },
  firstName: {
    isNotEmpty: 'First name is required.',
  },
};

@InputType()
export class SignupDto {
  @Field()
  @IsNotEmpty({
    message: SIGNUP_DTO_VALIDATION_ERROR_MESSAGES.email.isNotEmpty,
  })
  @IsEmail(
    {},
    {
      message: SIGNUP_DTO_VALIDATION_ERROR_MESSAGES.email.isEmail,
    },
  )
  @Transform(({ value }) => value?.toLowerCase())
  email: string;

  @Field()
  @IsNotEmpty({
    message: SIGNUP_DTO_VALIDATION_ERROR_MESSAGES.password.isNotEmpty,
  })
  @MinLength(8, {
    message: SIGNUP_DTO_VALIDATION_ERROR_MESSAGES.password.minLength,
  })
  @MaxLength(28, {
    message: SIGNUP_DTO_VALIDATION_ERROR_MESSAGES.password.maxLength,
  })
  @Matches(/(?=.*[0-9])/, {
    message: SIGNUP_DTO_VALIDATION_ERROR_MESSAGES.password.matchesNumber,
  })
  @Matches(/(?=.*[A-Z])/, {
    message: SIGNUP_DTO_VALIDATION_ERROR_MESSAGES.password.matchesUppercase,
  })
  @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
    message:
      SIGNUP_DTO_VALIDATION_ERROR_MESSAGES.password.matchesSpecialCharacter,
  })
  password: string;

  @Field()
  @IsNotEmpty({
    message: SIGNUP_DTO_VALIDATION_ERROR_MESSAGES.userName.isNotEmpty,
  })
  @MinLength(6, {
    message: SIGNUP_DTO_VALIDATION_ERROR_MESSAGES.userName.minLength,
  })
  @MaxLength(20, {
    message: SIGNUP_DTO_VALIDATION_ERROR_MESSAGES.userName.maxLength,
  })
  @IsAlphanumeric(undefined, {
    message: SIGNUP_DTO_VALIDATION_ERROR_MESSAGES.userName.isAlphanumeric,
  })
  @Transform(({ value }) => value?.toLowerCase())
  userName: string;

  @Field()
  @IsNotEmpty({
    message: SIGNUP_DTO_VALIDATION_ERROR_MESSAGES.firstName.isNotEmpty,
  })
  firstName: string;

  @Field({ nullable: true })
  lastName?: string;
}
