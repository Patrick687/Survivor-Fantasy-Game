import { Field, InputType } from '@nestjs/graphql';
import { LeagueMemberRole } from '@prisma/client';
import { IsEnum } from 'class-validator';

@InputType()
export class UpdateMemberRoleDto {
  @Field(() => String, { nullable: false })
  leagueId: string;

  @Field(() => String, { nullable: false })
  targetUserId: string;

  @Field(() => LeagueMemberRole, { nullable: false })
  @IsEnum(LeagueMemberRole, {
    message: `Role must be one of the following: ${Object.values(LeagueMemberRole).join(', ')}`,
  })
  newRole: LeagueMemberRole;
}
