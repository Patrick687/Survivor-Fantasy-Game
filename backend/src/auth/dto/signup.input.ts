import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { Trim } from 'src/common/dto/trim.decorator';

@InputType()
export class SignupInput {
  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  @MaxLength(120)
  @Matches(/^[A-Za-z]+$/, {
    message: 'First name must be alphabetic with no spaces.',
  })
  @Trim()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  @MaxLength(120)
  @Matches(/^[A-Za-z]+$/, {
    message: 'Last name must be alphabetic with no spaces.',
  })
  @Trim()
  lastName?: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(24)
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'Username must be alphanumeric with no spaces.',
  })
  @Trim()
  userName: string;

  @Field()
  @IsEmail()
  @Trim()
  email: string;

  @Field()
  @MinLength(8)
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter.',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter.',
  })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number.' })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'Password must contain at least one special character.',
  })
  password: string;

  @Field()
  @IsBoolean()
  isPrivate: boolean;
}
