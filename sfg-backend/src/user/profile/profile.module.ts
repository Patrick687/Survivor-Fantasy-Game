import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';

@Module({
  imports: [PrismaModule],
  providers: [ProfileRepository, ProfileService, ProfileResolver],
  exports: [ProfileService],
})
export class ProfileModule {}
