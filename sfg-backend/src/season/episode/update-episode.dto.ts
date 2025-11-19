import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsString,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

@InputType()
export class UpdateEpisodeDto {
  @Field(() => Int, { description: 'Season ID this episode belongs to' })
  @IsInt()
  @Min(1, { message: 'Season ID must be at least 1.' })
  seasonId: number;

  @Field(() => Int, {
    description: 'Episode number within the season to update',
  })
  @IsInt()
  @Min(1, { message: 'Episode number must be at least 1.' })
  episodeNumber: number;

  @Field(() => String, {
    nullable: true,
    description: 'Episode title',
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  title?: string;

  @Field(() => Date, {
    nullable: true,
    description: 'When the episode airs or aired',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Air date must be a valid date string.' })
  airDate?: Date;
}
