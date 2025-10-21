import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Password as PasswordPrisma, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordRepository } from './password.repository';

type RawPassword = PasswordPrisma['hash'];

@Injectable()
export class PasswordService {
  private readonly bcryptSaltRounds = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordRepository: PasswordRepository,
  ) {}
  async createPassword(
    data: {
      userId: PasswordPrisma['userId'];
      rawPassword: RawPassword;
    },
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<void> {
    const hashedPassword = await this.hashPassword(data.rawPassword);

    await this.passwordRepository.createPassword(
      {
        userId: data.userId,
        hash: hashedPassword,
      },
      prismaClient,
    );
  }

  async validatePassword(
    data: {
      userId: PasswordPrisma['userId'];
      rawPassword: RawPassword;
    },
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<boolean> {
    const passwordRecord = await this.passwordRepository.getCurrentPassword(
      data.userId,
      prismaClient,
    );
    if (!passwordRecord) {
      throw new NotFoundException(
        `Password for userId=${data.userId} not found`,
      );
    }
    return await this.comparePasswords(data.rawPassword, passwordRecord.hash);
  }

  private async hashPassword(
    rawPassword: RawPassword,
  ): Promise<PasswordPrisma['hash']> {
    return await bcrypt.hash(rawPassword, this.bcryptSaltRounds);
  }

  private async comparePasswords(
    rawPassword: RawPassword,
    hashedPassword: PasswordPrisma['hash'],
  ): Promise<boolean> {
    return await bcrypt.compare(rawPassword, hashedPassword);
  }
}
