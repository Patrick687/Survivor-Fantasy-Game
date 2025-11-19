import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SeasonService } from './season.service';
import { SeasonResolver } from './season.resolver';
import { SeasonRepository } from './season.repository';
import { EpisodeModule } from './episode/episode.module';

@Module({
  imports: [PrismaModule, EpisodeModule],
  providers: [SeasonService, SeasonResolver, SeasonRepository],
  exports: [SeasonService],
})
export class SeasonModule {}
