// src/season/dto/create-season.dto.ts
import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class CreateSeasonDto {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  seasonId: number;

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
  @Transform(({ value }) => (value === null ? null : value))
  airStartDate?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'airEndDate must be a valid ISO 8601 date string' },
  )
  @Transform(({ value }) => (value === null ? null : value))
  airEndDate?: string | null;
}
