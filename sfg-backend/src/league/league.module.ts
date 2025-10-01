import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LeagueMemberModule } from './member/league-member.module';
import { SeasonModule } from 'src/season/season.module';
import { UserModule } from 'src/user/user.module';
import { LeagueRepository } from './league.repository';
import { LeagueService } from './league.service';
import { LeagueResolver } from './league.resolver';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => LeagueMemberModule),
    SeasonModule,
    UserModule,
  ],
  providers: [LeagueRepository, LeagueService, LeagueResolver],
  exports: [LeagueService],
})
export class LeagueModule {}
