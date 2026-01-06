import { Field, InputType } from '@nestjs/graphql';
import { LeagueInviteCode } from '@prisma/client';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateLeagueInviteCodeInput {
  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  leagueId: LeagueInviteCode['leagueId'];
}
