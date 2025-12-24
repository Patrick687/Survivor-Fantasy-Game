import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PasswordModule } from './password/password.module';

@Module({
  imports: [PrismaModule, PasswordModule],
  providers: [UserRepository, UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
