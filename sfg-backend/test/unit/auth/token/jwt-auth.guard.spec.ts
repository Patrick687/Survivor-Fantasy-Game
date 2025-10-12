import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../../../src/auth/token/jwt-auth.guard';
import { MockFactories } from '../../utils/mock-factories';
import { JwtPayload } from '../../../../src/auth/token/jwt-payload.type';
import { UserRole } from '@prisma/client';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  const mockJwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (headers: any = {}): ExecutionContext => {
    const mockRequest = { headers };
    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  };

  describe('canActivate', () => {
    it('should allow access with valid JWT token', () => {
      // Arrange
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
      const payload: JwtPayload = MockFactories.createJwtPayload({
        userId: 'test-user-id',
        userRole: UserRole.USER,
      });
      const context = createMockExecutionContext({
        authorization: `Bearer ${validToken}`,
      });

      mockJwtService.verify.mockReturnValue(payload);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(jwtService.verify).toHaveBeenCalledWith(validToken);
      expect(context.switchToHttp().getRequest().user).toBe(payload);
    });

    it('should handle different user roles correctly', () => {
      // Arrange
      const validToken = 'admin-token';
      const adminPayload: JwtPayload = MockFactories.createJwtPayload({
        userId: 'admin-user-id',
        userRole: UserRole.ADMIN,
      });
      const context = createMockExecutionContext({
        authorization: `Bearer ${validToken}`,
      });

      mockJwtService.verify.mockReturnValue(adminPayload);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(context.switchToHttp().getRequest().user).toBe(adminPayload);
    });

    it('should throw UnauthorizedException when token is missing', () => {
      // Arrange
      const context = createMockExecutionContext(); // No authorization header

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(context)).toThrow(
        'Missing or invalid Authorization header',
      );
      expect(jwtService.verify).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when authorization header is malformed', () => {
      // Arrange
      const context = createMockExecutionContext({
        authorization: 'InvalidFormat', // Missing "Bearer " prefix
      });

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(context)).toThrow(
        'Missing or invalid Authorization header',
      );
      expect(jwtService.verify).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when authorization header has no token', () => {
      // Arrange
      const context = createMockExecutionContext({
        authorization: 'Bearer ', // Missing token after "Bearer "
      });

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(context)).toThrow(
        'Invalid or expired token',
      );
    });

    it('should throw UnauthorizedException when JWT verification fails', () => {
      // Arrange
      const invalidToken = 'invalid.jwt.token';
      const context = createMockExecutionContext({
        authorization: `Bearer ${invalidToken}`,
      });

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(context)).toThrow(
        'Invalid or expired token',
      );
      expect(jwtService.verify).toHaveBeenCalledWith(invalidToken);
    });

    it('should handle Authorization header case-sensitively (Bearer required)', () => {
      // Arrange
      const validToken = 'test-token';
      const context = createMockExecutionContext({
        authorization: `bearer ${validToken}`, // lowercase "bearer"
      });

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(context)).toThrow(
        'Missing or invalid Authorization header',
      );
    });

    it('should handle authorization header properly', () => {
      // Arrange
      const validToken = 'test-token';
      const payload: JwtPayload = MockFactories.createJwtPayload();
      const context = createMockExecutionContext({
        authorization: `Bearer ${validToken}`,
      });

      mockJwtService.verify.mockReturnValue(payload);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(jwtService.verify).toHaveBeenCalledWith(validToken);
    });

    it('should handle expired token gracefully', () => {
      // Arrange
      const expiredToken = 'expired.jwt.token';
      const context = createMockExecutionContext({
        authorization: `Bearer ${expiredToken}`,
      });

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(context)).toThrow(
        'Invalid or expired token',
      );
      expect(jwtService.verify).toHaveBeenCalledWith(expiredToken);
    });

    it('should handle empty token after Bearer', () => {
      // Arrange
      const context = createMockExecutionContext({
        authorization: 'Bearer ',
      });

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(context)).toThrow(
        'Invalid or expired token',
      );
    });
  });
});
