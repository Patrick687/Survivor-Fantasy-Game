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
    message: 'Alphabetic characters (no spaces) only.',
  })
  @Trim()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  @MaxLength(120)
  @Matches(/^[A-Za-z]+$/, {
    message: 'Alphabetic characters (no spaces) only.',
  })
  @Trim()
  lastName?: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(24)
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'Alphanumeric characters (no spaces) only.',
  })
  @Trim()
  userName: string;

  @Field()
  @IsEmail()
  @Trim()
  email: string;

  @Field()
  @MinLength(8, {
    message: 'Must be at least 8 characters long.',
  })
  @Matches(/[A-Z]/, {
    message: 'Must contain at least one uppercase letter.',
  })
  @Matches(/[a-z]/, {
    message: 'Must contain at least one lowercase letter.',
  })
  @Matches(/[0-9]/, { message: 'Must contain at least one number.' })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'Must contain at least one special character.',
  })
  password: string;

  @Field()
  @IsBoolean()
  isPrivate: boolean;
}
