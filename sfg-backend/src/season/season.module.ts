import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SeasonService } from './season.service';
import { SeasonResolver } from './season.resolver';
import { SeasonRepository } from './season.repository';

@Module({
  imports: [PrismaModule],
  providers: [SeasonService, SeasonResolver, SeasonRepository],
  exports: [SeasonService],
})
export class SeasonModule {}
