import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { PasswordModule } from './password/password.module';

@Module({
  imports: [PrismaModule, PasswordModule],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
})
export class UserModule {}
