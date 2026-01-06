import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LeagueInviteCodeRepository } from './league-invite-code.repository';
import { LeagueInviteCodeResolver } from './league-invite-code.resolver';
import { LeagueInviteCodeService } from './league-invite-code.service';
import { LeagueModule } from 'src/league/league.module';
import { LeagueMemberModule } from '../league-member.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => LeagueModule),
    forwardRef(() => LeagueMemberModule),
  ],
  providers: [
    LeagueInviteCodeRepository,
    LeagueInviteCodeResolver,
    LeagueInviteCodeService,
  ],
  exports: [LeagueInviteCodeService],
})
export class LeagueInviteCodeModule {}
