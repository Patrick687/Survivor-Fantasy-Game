import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PasswordRepository } from './password.repository';
import { PasswordService } from './password.service';

@Module({
  imports: [PrismaModule],
  providers: [PasswordRepository, PasswordService],
  //Do not Password PasswordRepository - only expose the service for security.
  exports: [PasswordService],
})
export class PasswordModule {}
