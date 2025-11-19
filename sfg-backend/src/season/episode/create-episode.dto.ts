import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

@InputType()
export class CreateEpisodeDto {
  @Field(() => Int)
  @IsInt()
  @Min(1, { message: 'Season ID must be at least 1.' })
  seasonId: number;

  @Field(() => Int)
  @IsInt()
  @Min(1, {
    message: 'Episode number must be at least 1.',
  })
  episodeNumber: number;

  @Field(() => String, { nullable: true, defaultValue: 'TBD' })
  @IsOptional()
  @Length(1, 200, {
    message: 'Title must be between 1 and 200 characters long.',
  })
  @IsString({
    message: 'Title must be a string.',
  })
  title?: string;

  @Field(() => Date)
  @IsDateString(
    {},
    {
      message: 'Air date must be a valid date string.',
    },
  )
  airDate: Date;
}
