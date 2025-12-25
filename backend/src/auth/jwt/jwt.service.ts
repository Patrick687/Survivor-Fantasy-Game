import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
const ms = require('ms');

type JwtPayload = {
  sub: string; //userid
};

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  private getJwtSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  async signWithExpiry(
    payload: JwtPayload,
  ): Promise<{ token: string; expiresAt: Date }> {
    const expiresIn = this.configService.getOrThrow<string>(
      'JWT_EXPIRES_IN',
      '1h',
    );
    const expiresMs = ms(expiresIn);
    const expiresAt = new Date(
      Date.now() + (typeof expiresMs === 'number' ? expiresMs : 0),
    );

    const token = await this.jwtService.signAsync(payload, {
      secret: this.getJwtSecret(),
    });
    return { token, expiresAt };
  }

  async verifyAsync(token: string): Promise<JwtPayload> {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.getJwtSecret(),
    });
    return payload;
  }
}
