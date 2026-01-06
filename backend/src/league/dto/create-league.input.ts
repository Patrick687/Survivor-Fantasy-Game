import { Field, InputType, Int } from '@nestjs/graphql';
import { League, Season } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/common/dto/trim.decorator';

@InputType()
export class CreateLeagueInput {
  @Field(() => Int, { nullable: false, name: 'seasonId' })
  @IsNumber()
  seasonId: Season['id'];

  @Field(() => String, { nullable: false, name: 'name' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  name: League['name'];

  @Field(() => String, { nullable: true, name: 'description' })
  @IsOptional()
  @Trim()
  description?: League['description'];
}
