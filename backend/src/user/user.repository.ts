import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { BaseRepository } from 'src/common/repository/base.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async findByUnique(
    args: Prisma.UserFindUniqueArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<User | null> {
    return this.getPrismaClient(tx).user.findUnique(args);
  }

  async findByUsernameOrEmail(
    identifier: string,
    tx?: Prisma.TransactionClient,
  ): Promise<User | null> {
    return this.getPrismaClient(tx).user.findFirst({
      where: {
        OR: [
          { userName: { equals: identifier, mode: 'insensitive' } },
          { email: { equals: identifier, mode: 'insensitive' } },
        ],
      },
    });
  }

  async create(
    args: Prisma.UserCreateArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    return this.getPrismaClient(tx).user.create(args);
  }

  async update(
    args: Prisma.UserUpdateArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    return this.getPrismaClient(tx).user.update(args);
  }
}
