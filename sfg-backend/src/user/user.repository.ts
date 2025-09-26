import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUser<K extends keyof User>(
    field: K,
    value: User[K],
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<User | null> {
    const userRecord = await prismaClient.user.findFirst({
      where: { [field]: value },
    });

    return userRecord;
  }

  async findUserByUnique(
    where: Prisma.UserWhereUniqueInput,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<User | null> {
    return prismaClient.user.findUnique({ where });
  }

  async createUser(
    { email }: Prisma.UserCreateInput,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<User> {
    return prismaClient.user.create({
      data: { email },
    });
  }
}
