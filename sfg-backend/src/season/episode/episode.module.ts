import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { EpisodeResolver } from './episode.resolver';
import { EpisodeService } from './episode.service';
import { EpisodeRepository } from './episode.repository';
import { SeasonModule } from '../season.module';

@Module({
  imports: [PrismaModule, forwardRef(() => SeasonModule)],
  providers: [EpisodeResolver, EpisodeService, EpisodeRepository],
  exports: [EpisodeService, EpisodeRepository],
})
export class EpisodeModule {}
