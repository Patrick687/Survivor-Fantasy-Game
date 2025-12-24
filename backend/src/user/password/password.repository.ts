import { Injectable } from '@nestjs/common';
import { Password, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/common/repository/base.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PasswordRepository extends BaseRepository {
  constructor(readonly prismaService: PrismaService) {
    super(prismaService);
  }

  async create(
    args: Prisma.PasswordCreateArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<Password> {
    return await this.getPrismaClient(tx).password.create(args);
  }

  async findByUnique(
    args: Prisma.PasswordFindUniqueArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<Password | null> {
    return this.getPrismaClient(tx).password.findUnique(args);
  }

  async setPassword(
    args: {
      where: Prisma.PasswordWhereUniqueInput;
      data: {
        hashedPassword: string;
      };
    },
    tx?: Prisma.TransactionClient,
  ): Promise<Password> {
    return await this.getPrismaClient(tx).password.update({
      where: args.where,
      data: {
        hash: args.data.hashedPassword,
      },
    });
  }
}
