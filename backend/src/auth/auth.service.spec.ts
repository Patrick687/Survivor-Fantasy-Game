import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from './jwt/jwt.service';
import { Prisma } from '@prisma/client';
import { LoginInput } from './dto/login.input';
import { AuthSession } from './auth-session.entity';
import { User } from 'src/user/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create user and return AuthSession', async () => {
      const userArgs: Prisma.UserCreateInput = {
        userName: 'john',
        email: 'john@example.com',
      } as any;
      const passwordArgs = { password: 'StrongP@ssw0rd' };
      const user: User = {
        userId: '123',
        userName: 'john',
        email: 'john@example.com',
      } as any;
      const session: AuthSession = { token: 'token' };

      (userService.createUser as jest.Mock).mockResolvedValue(user);
      (jwtService.signWithExpiry as jest.Mock).mockResolvedValue(session);

      const result = await service.signup({ userArgs, passwordArgs });
      expect(userService.createUser).toHaveBeenCalledWith(
        userArgs,
        passwordArgs,
      );
      expect(jwtService.signWithExpiry).toHaveBeenCalledWith({
        sub: user.userId,
      });
      expect(result).toEqual(session);
    });

    it('should throw if userService.createUser throws', async () => {
      (userService.createUser as jest.Mock).mockRejectedValue(
        new Error('fail'),
      );
      await expect(
        service.signup({ userArgs: {} as any, passwordArgs: { password: '' } }),
      ).rejects.toThrow('fail');
    });
  });

  describe('login', () => {
    it('should validate credentials and return AuthSession', async () => {
      const input: LoginInput = {
        userNameOrEmail: 'john',
        password: 'StrongP@ssw0rd',
      } as any;
      const user: User = {
        userId: '123',
        userName: 'john',
        email: 'john@example.com',
      } as any;
      const session: AuthSession = { token: 'token' };

      (userService.validateUserCredentials as jest.Mock).mockResolvedValue(
        user,
      );
      (jwtService.signWithExpiry as jest.Mock).mockResolvedValue(session);

      const result = await service.login(input);
      expect(userService.validateUserCredentials).toHaveBeenCalledWith(
        input.userNameOrEmail,
        input.password,
      );
      expect(jwtService.signWithExpiry).toHaveBeenCalledWith({
        sub: user.userId,
      });
      expect(result).toEqual(session);
    });

    it('should throw if userService.validateUserCredentials throws', async () => {
      (userService.validateUserCredentials as jest.Mock).mockRejectedValue(
        new Error('invalid'),
      );
      await expect(
        service.login({ userNameOrEmail: 'john', password: 'bad' } as any),
      ).rejects.toThrow('invalid');
    });
  });

  describe('getUserFromSession', () => {
    it('should verify token and return user', async () => {
      const session: AuthSession = { token: 'token' };
      const payload = { sub: '123' };
      const user: User = {
        userId: '123',
        userName: 'john',
        email: 'john@example.com',
      } as any;

      (jwtService.verifyAsync as jest.Mock).mockResolvedValue(payload);
      (userService.getUser as jest.Mock).mockResolvedValue(user);

      const result = await service.getUserFromSession(session);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(session.token);
      expect(userService.getUser).toHaveBeenCalledWith({ id: payload.sub });
      expect(result).toEqual(user);
    });

    it('should throw if jwtService.verifyAsync throws', async () => {
      (jwtService.verifyAsync as jest.Mock).mockRejectedValue(
        new Error('bad token'),
      );
      await expect(
        service.getUserFromSession({ token: 'bad' }),
      ).rejects.toThrow('bad token');
    });

    it('should throw if userService.getUser throws', async () => {
      (jwtService.verifyAsync as jest.Mock).mockResolvedValue({ sub: '123' });
      (userService.getUser as jest.Mock).mockRejectedValue(
        new Error('not found'),
      );
      await expect(
        service.getUserFromSession({ token: 'token' }),
      ).rejects.toThrow('not found');
    });
  });

  describe('setupAndCreateAuthSessionForUser (private)', () => {
    it('should create AuthSession for user', async () => {
      const user: User = {
        userId: '123',
        userName: 'john',
        email: 'john@example.com',
      } as any;
      const session: AuthSession = { token: 'token' };
      (jwtService.signWithExpiry as jest.Mock).mockResolvedValue(session);

      // @ts-expect-error: private method
      const result = await service.setupAndCreateAuthSessionForUser(user);
      expect(jwtService.signWithExpiry).toHaveBeenCalledWith({
        sub: user.userId,
      });
      expect(result).toEqual(session);
    });
  });
});
