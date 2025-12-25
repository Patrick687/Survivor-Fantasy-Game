import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { AuthSession } from './auth-session.entity';
import { UserService } from 'src/user/user.service';
import { Prisma } from '@prisma/client';
import { JwtService } from './jwt/jwt.service';
import { LoginInput } from './dto/login.input';

type JwtPayload = {
  sub: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup({
    userArgs,
    passwordArgs,
  }: {
    userArgs: Prisma.UserCreateInput;
    passwordArgs: { password: string };
  }): Promise<AuthSession> {
    const user: User = await this.userService.createUser(
      userArgs,
      passwordArgs,
    );
    return await this.setupAndCreateAuthSessionForUser(user);
  }

  async login(input: LoginInput): Promise<AuthSession> {
    const user: User = await this.userService.validateUserCredentials(
      input.userNameOrEmail,
      input.password,
    );
    return await this.setupAndCreateAuthSessionForUser(user);
  }

  private async setupAndCreateAuthSessionForUser(
    user: User,
  ): Promise<AuthSession> {
    const payload: JwtPayload = { sub: user.userId };
    const { token, expiresAt } = await this.jwtService.signWithExpiry(payload);

    return {
      token,
      expiresAt,
    };
  }

  async getUserFromSession(session: AuthSession): Promise<User> {
    const payload: JwtPayload = await this.jwtService.verifyAsync(
      session.token,
    );
    const user: User = await this.userService.getUser({ id: payload.sub });
    return user;
  }
}
