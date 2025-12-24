import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [PrismaModule, UserModule, JwtModule],
  providers: [AuthResolver, AuthService],
  exports: [],
})
export class AuthModule {}
