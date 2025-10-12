import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ProfileModule } from './profile/profile.module';
import { PasswordModule } from './password/password.module';
import './entities/user-role.enum';
import { UserResolver } from './user.resolver';

@Module({
  imports: [PrismaModule, ProfileModule, PasswordModule],
  providers: [UserService, UserRepository, UserResolver],
  exports: [UserService],
})
export class UserModule {}
