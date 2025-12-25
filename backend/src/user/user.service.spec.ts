import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UserService } from 'src/user/user.service';
import { Prisma } from '@prisma/client';
import { User } from 'src/user/user.entity';
import { JwtService } from 'src/auth/jwt/jwt.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthSession } from 'src/auth/auth-session.entity';
import { LoginInput } from 'src/auth/dto/login.input';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
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
      const session: AuthSession = { token: 'token', expiresAt: new Date() };

      userService.createUser.mockResolvedValue(user);
      jwtService.signWithExpiry.mockResolvedValue(session);

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
      userService.createUser.mockRejectedValue(new Error('fail'));
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
      const session: AuthSession = { token: 'token', expiresAt: new Date() };

      userService.validateUserCredentials.mockResolvedValue(user);
      jwtService.signWithExpiry.mockResolvedValue(session);

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
      userService.validateUserCredentials.mockRejectedValue(
        new Error('invalid'),
      );
      await expect(
        service.login({ userNameOrEmail: 'john', password: 'bad' } as any),
      ).rejects.toThrow('invalid');
    });
  });

  describe('getUserFromSession', () => {
    it('should verify token and return user', async () => {
      const session: AuthSession = { token: 'token', expiresAt: new Date() };
      const payload = { sub: '123' };
      const user: User = {
        userId: '123',
        userName: 'john',
        email: 'john@example.com',
      } as any;

      jwtService.verifyAsync.mockResolvedValue(payload);
      userService.getUser.mockResolvedValue(user);

      const result = await service.getUserFromSession(session);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(session.token);
      expect(userService.getUser).toHaveBeenCalledWith({ id: payload.sub });
      expect(result).toEqual(user);
    });

    it('should throw if jwtService.verifyAsync throws', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('bad token'));
      await expect(
        service.getUserFromSession({ token: 'bad', expiresAt: new Date() }),
      ).rejects.toThrow('bad token');
    });

    it('should throw if userService.getUser throws', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: '123' });
      userService.getUser.mockRejectedValue(new Error('not found'));
      await expect(
        service.getUserFromSession({ token: 'token', expiresAt: new Date() }),
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
      const session: AuthSession = { token: 'token', expiresAt: new Date() };
      jwtService.signWithExpiry.mockResolvedValue(session);

      // @ts-expect-error: private method
      const result = await service.setupAndCreateAuthSessionForUser(user);
      expect(jwtService.signWithExpiry).toHaveBeenCalledWith({
        sub: user.userId,
      });
      expect(result).toEqual(session);
    });
  });
});
