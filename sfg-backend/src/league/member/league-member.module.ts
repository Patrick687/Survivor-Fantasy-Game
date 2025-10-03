import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LeagueMemberRepository } from './league-member.repository';
import { LeagueMemberService } from './league-member.service';
import { LeagueMemberResolver } from './league-member.resolver';
import { UserModule } from 'src/user/user.module';
import { LeagueModule } from '../league.module';
import './entities/league-member-role.enum';

@Module({
  imports: [PrismaModule, UserModule, forwardRef(() => LeagueModule)],
  providers: [
    LeagueMemberRepository,
    LeagueMemberService,
    LeagueMemberResolver,
  ],
  exports: [LeagueMemberService],
})
export class LeagueMemberModule {}
