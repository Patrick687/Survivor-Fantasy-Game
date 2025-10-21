import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from './token.repository';
import { Token } from '@prisma/client';
import { JwtPayload } from './jwt-payload.type';
import { randomBytes } from 'crypto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async issueTokenForUser(
    userId: JwtPayload['userId'],
    userRole: JwtPayload['userRole'],
    expiresIn: string | number = '1d',
  ): Promise<{ token: string; tokenRecord: Token }> {
    const jti = randomBytes(16).toString('hex'); // Generate a random JWT ID
    const iat = Math.floor(Date.now() / 1000);

    const payload: JwtPayload = { userId, userRole, jti, iat };
    const token = await this.jwtService.signAsync(payload, { expiresIn });

    const expiresAt = new Date(
      Date.now() +
        (typeof expiresIn === 'string' ?
          this.msToMs(expiresIn)
        : expiresIn * 1000),
    );

    const tokenRecord = await this.tokenRepository.createToken({
      userId,
      token,
      expiresAt,
    });

    return { token, tokenRecord };
  }

  private msToMs(str: string): number {
    // Simple parser for '1d', '2h', '30m', '10s'
    const match = /^(\d+)([smhd])$/.exec(str);
    if (!match) return 24 * 60 * 60 * 1000; // default 1d
    const num = parseInt(match[1], 10);
    switch (match[2]) {
      case 's':
        return num * 1000;
      case 'm':
        return num * 60 * 1000;
      case 'h':
        return num * 60 * 60 * 1000;
      case 'd':
        return num * 24 * 60 * 60 * 1000;
      default:
        return 24 * 60 * 60 * 1000;
    }
  }
}
