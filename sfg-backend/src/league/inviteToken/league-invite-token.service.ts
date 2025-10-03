import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LeagueInviteTokenRepository } from './league-invite-token.repository';
import { League, LeagueInviteToken } from '@prisma/client';
import crypto from 'crypto';

@Injectable()
export class LeagueInviteTokenService {
  constructor(
    private readonly leagueInviteTokenRepository: LeagueInviteTokenRepository,
  ) {}

  async generateToken(
    leagueId: LeagueInviteToken['leagueId'],
    createdBy: LeagueInviteToken['createdBy'],
    expiresInMinutes: number = 30,
  ): Promise<LeagueInviteToken['token']> {
    const token = this.createSecureToken();
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await this.leagueInviteTokenRepository.create({
      league: { connect: { leagueId } },
      creator: { connect: { userId: createdBy } },
      token,
      expiresAt,
    });
    return token;
  }

  async validateAndUseToken(
    token: LeagueInviteToken['token'],
  ): Promise<{ leagueId: League['leagueId'] }> {
    const inviteToken =
      await this.leagueInviteTokenRepository.findValidToken(token);
    if (!inviteToken) {
      throw new UnauthorizedException('Invalid or expired invite token');
    }

    await this.leagueInviteTokenRepository.incrementUsage(inviteToken.id);

    return { leagueId: inviteToken.leagueId };
  }

  private createSecureToken(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 characters
  }
}
