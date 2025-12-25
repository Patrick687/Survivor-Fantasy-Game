import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordRepository } from './password.repository';
import { Password, Prisma } from '@prisma/client';

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  constructor(private readonly passwordRepository: PasswordRepository) {}

  private async encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  private async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async validatePasswordForUser(args: {
    userId: string;
    rawPassword: string;
  }): Promise<boolean> {
    const passwordRecord = await this.passwordRepository.findByUnique({
      where: {
        userId: args.userId,
      },
    });
    if (!passwordRecord) {
      throw new InternalServerErrorException(
        `Password record not found for user ID: ${args.userId}`,
      );
    }
    return await this.comparePassword(args.rawPassword, passwordRecord.hash);
  }

  async registerPasswordForUser(
    args: {
      userId: string;
      rawPassword: string;
    },
    tx?: Prisma.TransactionClient,
  ): Promise<Password> {
    const encryptedPassword = await this.encryptPassword(args.rawPassword);

    return await this.passwordRepository.create(
      {
        data: {
          userId: args.userId,
          hash: encryptedPassword,
        },
      },
      tx,
    );
  }
}
