import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LeagueInviteTokenService } from './league-invite-token.service';
import { LeagueInviteTokenRepository } from './league-invite-token.repository';
import { LeagueInviteTokenResolver } from './league-invite-token.resolver';
import { LeagueMemberModule } from '../member/league-member.module';

@Module({
  imports: [PrismaModule, forwardRef(() => LeagueMemberModule)],
  providers: [
    LeagueInviteTokenService,
    LeagueInviteTokenRepository,
    LeagueInviteTokenResolver,
  ],
  exports: [LeagueInviteTokenService],
})
export class LeagueInviteTokenModule {}
