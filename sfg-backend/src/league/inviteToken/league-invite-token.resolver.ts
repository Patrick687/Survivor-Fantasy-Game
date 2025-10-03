// src/league/invite-token/league-invite-token.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { LeagueInviteTokenService } from './league-invite-token.service';
import { LeagueMemberService } from '../member/league-member.service';
import { JwtAuthGuard } from '../../auth/token/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { type JwtPayload } from '../../auth/token/jwt-payload.type';
import { LeagueMemberEntity } from '../member/entities/league-member.entity';
import { LeagueContextGuard } from 'src/common/guards/league-context.guard';
import { LeagueRoleGuard } from 'src/common/guards/league-role.guard';
import { RequireLeagueRoles } from 'src/common/decorators/league-roles.decorator';
import { LeagueMemberRole } from '@prisma/client';
import {
  CurrentLeague,
  type CurrentLeagueContext,
} from 'src/common/decorators/current-league.decorator';

@Resolver()
export class LeagueInviteTokenResolver {
  private logger = new Logger(LeagueInviteTokenResolver.name);

  constructor(
    private readonly inviteTokenService: LeagueInviteTokenService,
    private readonly leagueMemberService: LeagueMemberService,
  ) {}

  @Mutation(() => String, { name: 'generateInviteCode' })
  @UseGuards(JwtAuthGuard, LeagueContextGuard, LeagueRoleGuard)
  @RequireLeagueRoles(LeagueMemberRole.ADMIN, LeagueMemberRole.OWNER)
  async generateInviteCode(
    @Args('leagueId') leagueId: string,
    @Args('expiresInMinutes', { defaultValue: 30 }) expiresInMinutes: number,
    @CurrentUser() user: JwtPayload,
    @CurrentLeague() currentLeague: CurrentLeagueContext,
  ): Promise<string> {
    this.logger.debug(
      `✉️ generateInviteCode called for leagueId: ${leagueId} by userId: ${user.userId}`,
    );

    // TODO: Add permission check - user must be admin/owner of league
    // const userMember = await this.leagueMemberService.getLeagueMember(user.userId, leagueId);
    // if (!['OWNER', 'ADMIN'].includes(userMember.role)) {
    //   throw new UnauthorizedException('Only league admins can generate invite codes');
    // }

    const token = await this.inviteTokenService.generateToken(
      leagueId,
      user.userId,
      expiresInMinutes,
    );

    this.logger.debug(
      `🎟️ Invite code ${token} generated for leagueId: ${leagueId}, expires in ${expiresInMinutes} minutes`,
    );

    return token;
  }

  @Mutation(() => LeagueMemberEntity, { name: 'joinLeagueWithToken' })
  @UseGuards(JwtAuthGuard)
  async joinLeagueWithToken(
    @Args('inviteToken') token: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<LeagueMemberEntity> {
    this.logger.debug(
      `✉️ joinLeagueWithToken called with token: ${token} by userId: ${user.userId}`,
    );

    const { leagueId } =
      await this.inviteTokenService.validateAndUseToken(token);

    this.logger.debug(
      `🎟️ Valid token found for leagueId: ${leagueId}, adding user to league`,
    );

    const newMember = await this.leagueMemberService.addMemberToLeague(
      user.userId,
      leagueId,
    );

    this.logger.debug(
      `🏆 User ${user.userId} successfully joined league ${leagueId} as ${newMember.role}`,
    );

    return newMember;
  }
}
