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

  async signWithExpiry(
    payload: JwtPayload,
  ): Promise<{ token: string; expiresAt: Date }> {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1h');
    const expiresMs = ms(expiresIn);
    const expiresAt = new Date(
      Date.now() + (typeof expiresMs === 'number' ? expiresMs : 0),
    );
    console.log('JWT_SECRET:', this.configService.get<string>('JWT_SECRET'));
    const token = await this.jwtService.signAsync(payload);
    return { token, expiresAt };
  }
  async verify(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
