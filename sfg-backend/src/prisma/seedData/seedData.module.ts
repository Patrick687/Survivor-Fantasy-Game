import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { DevSeedService } from './dev-seed-data.service';
import { SeedAllDataService } from './seedAllData.service';
import { TableSeedService } from './table-seed-data.service';
import { ConfigModule } from '@nestjs/config';
import { SeedFoundationDataService } from './foundation/seed-foundation-data.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [
    DevSeedService,
    SeedAllDataService,
    TableSeedService,
    SeedFoundationDataService,
  ],
  exports: [SeedAllDataService],
})
export class SeedDataModule {}
