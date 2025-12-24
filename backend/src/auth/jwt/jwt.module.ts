import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import {
  JwtModule as NestJwtModule,
  JwtSignOptions as NestJwtSignOptions,
} from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>(
            'JWT_EXPIRES_IN',
          ) as NestJwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
