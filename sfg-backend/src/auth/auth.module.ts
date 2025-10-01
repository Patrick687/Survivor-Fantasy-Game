import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { PasswordModule } from 'src/user/password/password.module';
import { UserModule } from 'src/user/user.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [PasswordModule, UserModule, TokenModule],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
