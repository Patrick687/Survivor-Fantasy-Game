import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsDateString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class UpdateSeasonDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  filmingLocation?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'airStartDate must be a valid ISO 8601 date string' },
  )
  @Transform(({ value }) => (value === null ? null : value)) // Handle null properly
  airStartDate?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'airEndDate must be a valid ISO 8601 date string' },
  )
  @Transform(({ value }) => (value === null ? null : value)) // Handle null properly
  airEndDate?: string | null;
}
