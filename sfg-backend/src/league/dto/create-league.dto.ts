import { Field, InputType, Int } from '@nestjs/graphql';
import { League } from '@prisma/client';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateLeagueDto {
  @Field(() => Int!, { nullable: false })
  @IsNotEmpty({
    message: 'Season ID is required.',
  })
  @IsNumber(
    {},
    {
      message: 'Season ID must be a number.',
    },
  )
  @IsPositive({
    message: 'Season ID must be a positive number.',
  })
  seasonId: League['seasonId'];

  @Field(() => String!, { nullable: false })
  @IsNotEmpty({
    message: 'League name is required.',
  })
  @MinLength(3, {
    message: 'League name must be at least 3 characters long.',
  })
  @MaxLength(100, {
    message: 'League name must be at most 100 characters long.',
  })
  name: League['leagueName'];
}
