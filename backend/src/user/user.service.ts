import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { User } from './user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from './user.repository';
import { PasswordService } from './password/password.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async getUser(uniqueArgs: Prisma.UserFindUniqueArgs['where']): Promise<User> {
    const user = await this.userRepository.findByUnique({ where: uniqueArgs });
    if (!user) {
      throw new NotFoundException(
        `User with given identifier not found`,
        JSON.stringify(uniqueArgs),
      );
    }
    return User.mapToEntity(user);
  }

  async createUser(
    userData: Prisma.UserCreateInput,
    passwordArgs: { password: string },
  ): Promise<User> {
    await this.validateSignup(userData);

    const { user } = await this.prismaService.$transaction(async (tx) => {
      const user = await this.userRepository.create({ data: userData }, tx);
      const password = await this.passwordService.registerPasswordForUser(
        {
          rawPassword: passwordArgs.password,
          userId: user.id,
        },
        tx,
      );
      return { user, password };
    });

    return User.mapToEntity(user);
  }

  async validateUserCredentials(
    userNameOrEmail: string,
    rawPassword: string,
  ): Promise<User> {
    const user =
      await this.userRepository.findByUsernameOrEmail(userNameOrEmail);
    if (!user) {
      throw new UnauthorizedException('Invalid username/email or password');
    }

    const isPasswordValid = await this.passwordService.validatePasswordForUser({
      rawPassword,
      userId: user.id,
    });
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username/email or password');
    }

    return User.mapToEntity(user);
  }

  private async validateSignup(
    data: Prisma.UserCreateArgs['data'],
  ): Promise<void> {
    const isEmailAvailable = await this.isEmailAvailable(data.email);
    if (!isEmailAvailable) {
      throw new ConflictException('Email is already in use');
    }

    const isUserNameAvailable = await this.isUserNameAvailable(data.userName);
    if (!isUserNameAvailable) {
      throw new ConflictException('Username is already in use');
    }
  }

  private async isUserNameAvailable(userName: string): Promise<boolean> {
    const user = await this.userRepository.findByUnique({
      where: {
        userName: userName,
      },
      ...(userName && { userName: { equals: userName, mode: 'insensitive' } }),
    });
    return !user;
  }

  private async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.userRepository.findByUnique({
      where: {
        email: email,
      },
      ...(email && { email: { equals: email, mode: 'insensitive' } }),
    });
    return !user;
  }
}
