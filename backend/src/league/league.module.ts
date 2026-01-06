import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LeagueService } from './league.service';
import { LeagueRepository } from './league.repository';
import { LeagueMemberModule } from './member/league-member.module';
import { LeagueResolver } from './league.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, LeagueMemberModule, UserModule],
  providers: [LeagueService, LeagueRepository, LeagueResolver],
  exports: [LeagueService],
})
export class LeagueModule {}
