import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from './user.repository';
import {
  Prisma,
  Profile,
  User as UserPrisma,
  UserRole as UserRolePrisma,
} from '@prisma/client';
import { ProfileService } from './profile/profile.service';
import { PasswordService } from './password/password.service';
import { UserRole } from './entities/user-role.enum';
import { UserDomain } from './user.domain';
import { ProfileRepository } from './profile/profile.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepository: UserRepository,
    private readonly profileService: ProfileService,
    private readonly passwordService: PasswordService,
  ) {}

  async getUser(where: Prisma.UserWhereUniqueInput): Promise<UserDomain> {
    const userRecord = await this.userRepository.findUserByUnique(where);

    if (!userRecord) {
      let criteria = '';
      if (where.userId) criteria = `userId = '${where.userId}'`;
      else if (where.email) criteria = `email = '${where.email}'`;
      throw new NotFoundException(`User where ${criteria} not found.`);
    }

    return {
      ...userRecord,
      role: this.mapUserRole(userRecord.role),
    };
  }

  private mapUserRole(role: UserRolePrisma): UserRole {
    switch (role) {
      case UserRolePrisma.ADMIN:
        return UserRole.ADMIN;
      case UserRolePrisma.USER:
        return UserRole.USER;
      default:
        throw new InternalServerErrorException(`Unknown user role: ${role}`);
    }
  }

  /**
   * @param where Criteria to find the profile (e.g., { userId: string } or { userName: string } or { id: string })
   * @returns The UserDomain associated with the profile
   * @throws NotFoundException if the profile or user is not found
   */
  async getUserByProfile(
    where: Prisma.ProfileWhereUniqueInput,
  ): Promise<UserDomain> {
    const profile = await this.profileService.getProfile(where);
    return await this.getUser({ userId: profile.userId });
  }

  async createUser(
    {
      userInfo,
      passwordInfo,
      profileInfo,
    }: {
      userInfo: Prisma.UserCreateInput;
      passwordInfo: { rawPassword: string };
      profileInfo: Prisma.ProfileUncheckedCreateWithoutUserInput;
    },
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<UserDomain> {
    const existingUserRecord = await this.userRepository.findUserByUnique({
      email: userInfo.email,
    });
    if (existingUserRecord) {
      throw new ConflictException(
        `User with email '${userInfo.email}' already exists.`,
      );
    }

    const existingProfileRecord = await this.profileService
      .getProfile({
        userName: profileInfo.userName,
      })
      .catch((err) => null);
    if (existingProfileRecord) {
      throw new ConflictException(
        `User with username '${profileInfo.userName}' already exists.`,
      );
    }

    let userRecord: UserPrisma;
    if ('$transaction' in prismaClient) {
      // prismaClient is PrismaService
      userRecord = await prismaClient.$transaction(async (tx) => {
        const userRecord = await this.userRepository.createUser(
          { email: userInfo.email },
          tx,
        );
        await this.profileService.createProfile(
          { ...profileInfo, userId: userRecord.userId },
          tx,
        );
        await this.passwordService.createPassword(
          { userId: userRecord.userId, rawPassword: passwordInfo.rawPassword },
          tx,
        );
        return userRecord;
      });
    } else {
      const tx = prismaClient;
      userRecord = await this.userRepository.createUser(
        { email: userInfo.email },
        tx,
      );
      await this.profileService.createProfile(
        { ...profileInfo, userId: userRecord.userId },
        tx,
      );
      await this.passwordService.createPassword(
        { userId: userRecord.userId, rawPassword: passwordInfo.rawPassword },
        tx,
      );
    }

    return await this.getUser({
      email: userInfo.email,
    });
  }
}
