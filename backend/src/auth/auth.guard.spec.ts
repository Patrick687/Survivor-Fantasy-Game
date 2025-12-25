import { AuthGuard } from './auth.guard';
import { JwtService } from './jwt/jwt.service';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { createMock } from '@golevelup/ts-jest';

// Utility to create a minimal mock ExecutionContext
function createMockContext(handler: any = () => {}, clazz: any = {}) {
  return {
    getHandler: () => handler,
    getClass: () => clazz,
  } as unknown as ExecutionContext;
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;

  beforeEach(() => {
    jwtService = createMock<JwtService>();
    reflector = createMock<Reflector>();
    guard = new AuthGuard(jwtService, reflector);
  });

  it('should allow access to public routes', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(true);
    const context = createMockContext();
    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should throw UnauthorizedException if no token', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);

    const req = { headers: {} };
    const ctx = {
      getContext: () => ({ req }),
    };
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(ctx as any);

    const context = createMockContext();
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);

    const req = { headers: { authorization: 'Bearer badtoken' } };
    const ctx = {
      getContext: () => ({ req }),
    };
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(ctx as any);

    (jwtService.verifyAsync as jest.Mock).mockRejectedValue(
      new Error('invalid'),
    );

    const context = createMockContext();
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should set req.user and allow access if token is valid', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);

    const req: any = { headers: { authorization: 'Bearer goodtoken' } };
    const ctx = {
      getContext: () => ({ req }),
    };
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(ctx as any);

    (jwtService.verifyAsync as jest.Mock).mockResolvedValue({ sub: 'user123' });

    const context = createMockContext();
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(req.user).toEqual({ sub: 'user123' });
  });

  it('should return undefined if authorization header is missing', () => {
    const req = { headers: {} };
    expect((guard as any).extractTokenFromHeader(req)).toBeUndefined();
  });

  it('should return undefined if authorization header is not Bearer', () => {
    const req = { headers: { authorization: 'Basic sometoken' } };
    expect((guard as any).extractTokenFromHeader(req)).toBeUndefined();
  });

  it('should return token if authorization header is Bearer', () => {
    const req = { headers: { authorization: 'Bearer sometoken' } };
    expect((guard as any).extractTokenFromHeader(req)).toBe('sometoken');
  });
});
