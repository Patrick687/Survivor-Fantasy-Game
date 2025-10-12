import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dtos/login.dto';
import { PasswordService } from 'src/user/password/password.service';
import { TokenService } from './token/token.service';
import { AuthPayloadDomain } from './entities/auth-payload.domain';
import { LeagueMemberService } from 'src/league/member/league-member.service';
import { JwtPayload } from './token/jwt-payload.type';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly leagueMemberService: LeagueMemberService,
  ) {}

  async signup({
    email,
    password,
    firstName,
    userName,
    lastName,
  }: SignupDto): Promise<AuthPayloadDomain> {
    try {
      this.logger.debug(`🚀 Starting signup for email: ${email}`);

      const user = await this.userService.createUser({
        userInfo: { email },
        passwordInfo: { rawPassword: password },
        profileInfo: { firstName, lastName, userName },
      });

      this.logger.debug(`✅ User created successfully: ${user.userId}`);

      const token = await this.tokenService.issueTokenForUser(
        user.userId,
        user.role,
        await this.getLeaguesPayload(user.userId),
      );

      this.logger.debug(`🎫 Token generated for user: ${user.userId}`);

      return {
        user,
        token: token.token,
      };
    } catch (error) {
      this.logger.error(`❌ Signup failed for email: ${email}`, error.stack);
      throw error;
    }
  }

  async login({
    userNameOrEmail,
    password,
  }: LoginDto): Promise<AuthPayloadDomain> {
    this.logger.debug(`🔍 Attempting login for: ${userNameOrEmail}`);

    let user: User;

    try {
      this.logger.debug('📧 Trying email lookup...');
      user = await this.userService.getUser({ email: userNameOrEmail });
      this.logger.debug(
        `✅ Found user by email: ${user.email} (ID: ${user.userId})`,
      );
    } catch (emailError) {
      this.logger.debug(`⚠️ Email lookup failed: ${emailError.message}`);

      try {
        this.logger.debug('📧 Trying username lookup...');
        user = await this.userService.getUserByProfile({
          userName: userNameOrEmail,
        });
        this.logger.debug(
          `✅ Found user by username: ${userNameOrEmail} (ID: ${user.userId})`,
        );
      } catch (usernameError) {
        this.logger.debug(
          `⚠️ Username lookup failed: ${usernameError.message}`,
        );
        this.logger.debug(
          `❌ Both email and username lookup failed for: ${userNameOrEmail}`,
        );
        throw new UnauthorizedException('Invalid credentials.');
      }
    }

    this.logger.debug(`🔐 Validating password for user: ${user.userId}`);

    const isValid = await this.passwordService.validatePassword({
      userId: user.userId,
      rawPassword: password,
    });

    if (!isValid) {
      this.logger.warn(`❌ Invalid password for user: ${user.userId}`);
      throw new UnauthorizedException('Invalid credentials.');
    }

    this.logger.debug(
      `✅ Password validation successful for user: ${user.userId}`,
    );

    const token = await this.tokenService.issueTokenForUser(
      user.userId,
      user.role,
      await this.getLeaguesPayload(user.userId),
    );

    this.logger.debug(
      `🎫 Token generated successfully for user: ${user.userId}`,
    );

    return {
      user,
      token: token.token,
    };
  }

  private async getLeaguesPayload(
    userId: string,
  ): Promise<JwtPayload['leagues']> {
    const userAsLeagueMembers =
      await this.leagueMemberService.getAllMembersForUser(userId);
    const leaguesPayload = userAsLeagueMembers.map((lm) => ({
      leagueId: lm.leagueId,
      role: lm.role,
    }));
    return leaguesPayload;
  }
}
