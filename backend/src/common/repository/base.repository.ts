import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export class BaseRepository {
  constructor(protected readonly prismaService: PrismaService) {}

  protected getPrismaClient(tx?: Prisma.TransactionClient) {
    return tx ?? this.prismaService;
  }
}
