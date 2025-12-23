import { Module } from '@nestjs/common';
import { HealthCheckResolver } from './health-check.resolver';
import { HealthCheckService } from './health-check.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [HealthCheckResolver, HealthCheckService],
})
export class HealthCheckModule {}
