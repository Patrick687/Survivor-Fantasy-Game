import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LeagueEntity } from 'src/league/league.entity';
import { LeagueService } from 'src/league/league.service';
import { LeagueMemberEntity } from './entities/league-member.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/token/jwt-auth.guard';
import { LeagueContextGuard } from 'src/common/guards/league-context.guard';
import { LeagueRoleGuard } from 'src/common/guards/league-role.guard';
import { LeagueMemberRole } from '@prisma/client';
import { RequireLeagueRoles } from 'src/common/decorators/league-roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type JwtPayload } from 'src/auth/token/jwt-payload.type';
import {
  CurrentLeague,
  type CurrentLeagueContext,
} from 'src/common/decorators/current-league.decorator';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { LeagueMemberService } from './league-member.service';

@Resolver(() => LeagueMemberEntity)
export class LeagueMemberResolver {
  private readonly logger = new Logger(LeagueMemberResolver.name);

  constructor(
    private readonly userService: UserService,
    private readonly leagueService: LeagueService,
    private readonly leagueMemberService: LeagueMemberService,
  ) {}

  @ResolveField(() => User, { name: 'user', nullable: false })
  async user(@Parent() leagueMember: LeagueMemberEntity): Promise<User> {
    return await this.userService.getUser({
      userId: leagueMember.userId,
    });
  }

  @ResolveField(() => LeagueEntity, { name: 'league', nullable: false })
  async league(
    @Parent() leagueMember: LeagueMemberEntity,
  ): Promise<LeagueEntity> {
    return await this.leagueService.getLeagueById(leagueMember.leagueId);
  }

  @Mutation(() => LeagueMemberEntity, { name: 'promoteMemberToAdmin' })
  @UseGuards(JwtAuthGuard, LeagueContextGuard, LeagueRoleGuard)
  @RequireLeagueRoles(LeagueMemberRole.OWNER, LeagueMemberRole.ADMIN)
  async promoteMemberToAdmin(
    @Args('leagueId') leagueId: string,
    @Args('targetUserId') targetUserId: string,
    @CurrentUser() user: JwtPayload,
    @CurrentLeague() currentLeague: CurrentLeagueContext,
  ): Promise<LeagueMemberEntity> {
    this.logger.debug(
      `👑 promoteMemberToAdmin called for leagueId: ${leagueId}, target: ${targetUserId}, by: ${user.userId}`,
    );

    const updateDto: UpdateMemberRoleDto = {
      leagueId,
      targetUserId,
      newRole: LeagueMemberRole.ADMIN,
    };

    const updatedMember = await this.leagueMemberService.updateMemberRole(
      user.userId,
      updateDto,
      currentLeague.role,
    );

    this.logger.debug(
      `✅ User ${targetUserId} promoted to ADMIN in league ${leagueId}`,
    );

    return updatedMember;
  }

  @Mutation(() => LeagueMemberEntity, { name: 'demoteAdminToMember' })
  @UseGuards(JwtAuthGuard, LeagueContextGuard, LeagueRoleGuard)
  @RequireLeagueRoles(LeagueMemberRole.OWNER) // Only owners can demote admins
  async demoteAdminToMember(
    @Args('leagueId') leagueId: string,
    @Args('targetUserId') targetUserId: string,
    @CurrentUser() user: JwtPayload,
    @CurrentLeague() currentLeague: CurrentLeagueContext,
  ): Promise<LeagueMemberEntity> {
    this.logger.debug(
      `👇 demoteAdminToMember called for leagueId: ${leagueId}, target: ${targetUserId}, by: ${user.userId}`,
    );

    const updateDto: UpdateMemberRoleDto = {
      leagueId,
      targetUserId,
      newRole: LeagueMemberRole.MEMBER,
    };

    const updatedMember = await this.leagueMemberService.updateMemberRole(
      user.userId,
      updateDto,
      currentLeague.role,
    );

    this.logger.debug(
      `✅ User ${targetUserId} demoted to MEMBER in league ${leagueId}`,
    );

    return updatedMember;
  }

  @Mutation(() => LeagueMemberEntity, { name: 'updateMemberRole' })
  @UseGuards(JwtAuthGuard, LeagueContextGuard, LeagueRoleGuard)
  @RequireLeagueRoles(LeagueMemberRole.OWNER, LeagueMemberRole.ADMIN)
  async updateMemberRole(
    @Args('input') input: UpdateMemberRoleDto,
    @CurrentUser() user: JwtPayload,
    @CurrentLeague() currentLeague: CurrentLeagueContext,
  ): Promise<LeagueMemberEntity> {
    this.logger.debug(
      `🔄 updateMemberRole called for input:`,
      JSON.stringify(input, null, 2),
    );

    const updatedMember = await this.leagueMemberService.updateMemberRole(
      user.userId,
      input,
      currentLeague.role,
    );

    this.logger.debug(
      `✅ User ${input.targetUserId} role updated to ${input.newRole} in league ${input.leagueId}`,
    );

    return updatedMember;
  }
}
