import { User } from 'src/user/entities/user.entity';
import { Profile } from 'src/user/profile/profile.entity';
import { UserRole } from 'src/user/entities/user-role.enum';
import { SignupDto } from 'src/auth/dtos/signup.dto';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { UserDomain } from 'src/user/user.domain';
import { JwtPayload } from 'src/auth/token/jwt-payload.type';
import {
  User as UserPrisma,
  Profile as ProfilePrisma,
  UserRole as UserRolePrisma,
  Token as TokenPrisma,
} from '@prisma/client';

export class MockFactories {
  // Domain types (for service return values)
  static createUser(overrides: Partial<UserDomain> = {}): UserDomain {
    return {
      userId: 'test-user-id-123',
      email: 'test@example.com',
      role: UserRole.USER,
      ...overrides,
    } as UserDomain;
  }

  // Database record types (for repository return values)
  static createUserRecord(overrides: Partial<UserPrisma> = {}): UserPrisma {
    return {
      userId: 'test-user-id-123',
      email: 'test@example.com',
      role: UserRolePrisma.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    } as UserPrisma;
  }

  static createProfile(overrides: Partial<Profile> = {}): Profile {
    return {
      id: 'test-profile-id-123',
      userId: 'test-user-id-123',
      firstName: 'Test',
      lastName: 'User',
      userName: 'testuser123',
      isPublic: false,
      ...overrides,
    } as Profile;
  }

  // Database record types (for repository return values)
  static createProfileRecord(
    overrides: Partial<ProfilePrisma> = {},
  ): ProfilePrisma {
    return {
      id: 'test-profile-id-123',
      userId: 'test-user-id-123',
      firstName: 'Test',
      lastName: 'User',
      userName: 'testuser123',
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    } as ProfilePrisma;
  }

  static createSignupDto(overrides: Partial<SignupDto> = {}): SignupDto {
    return {
      email: 'test@example.com', // Already lowercase for consistency
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User',
      userName: 'testuser123', // Already lowercase for consistency
      ...overrides,
    };
  }

  static createLoginDto(overrides: Partial<LoginDto> = {}): LoginDto {
    return {
      userNameOrEmail: 'test@example.com', // Already lowercase for consistency
      password: 'TestPass123!',
      ...overrides,
    };
  }

  // Token-related mocks
  static createJwtPayload(overrides: Partial<JwtPayload> = {}): JwtPayload {
    return {
      userId: 'test-user-id-123',
      userRole: UserRole.USER,
      ...overrides,
    };
  }

  static createTokenRecord(overrides: Partial<TokenPrisma> = {}): TokenPrisma {
    return {
      id: 'test-token-id-123',
      userId: 'test-user-id-123',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test',
      seq: 1,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    } as TokenPrisma;
  }
}
