import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenRepository } from './token.repository';
import { TokenService } from './token.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [TokenRepository, TokenService, JwtAuthGuard],
    exports: [TokenService, JwtModule, JwtAuthGuard],
})
export class TokenModule { }