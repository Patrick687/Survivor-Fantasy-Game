import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload as NestJwtPayload } from 'jsonwebtoken';

export interface JwtPayload extends NestJwtPayload {
  sub: string; // userid
}

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  private getJwtSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  async signWithExpiry(payload: JwtPayload): Promise<{ token: string }> {
    const expiresIn = this.configService.getOrThrow<string>('JWT_EXPIRES_IN');
    // const expiresInMs = ms(expiresIn);
    const signOptions: JwtSignOptions = {
      secret: this.getJwtSecret(),
      expiresIn: expiresIn as any, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    };
    const token = await this.jwtService.signAsync(payload, signOptions);
    return { token };
  }

  async verifyAsync(token: string): Promise<JwtPayload> {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.getJwtSecret(),
    });
    return payload;
  }
}
