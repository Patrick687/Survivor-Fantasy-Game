import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getHello(): Promise<string> {
    // Example upsert for testing PrismaService
    const upsertUser: Prisma.UserUpsertArgs = {
      where: { email: 'test@mail.com', userName: 'testuser' },
      update: {},
      create: {
        email: 'test@mail.com',
        userName: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        password: {
          create: {
            hash: 'hashedpassword',
          },
        },
      },
      include: { password: true },
    };
    const user = await this.prismaService.user.upsert(upsertUser);
    const userFound = await this.prismaService.user.findFirst({
      where: { email: 'test@mail.com' },
    });
    this.logger.log(`Upserted user: ${JSON.stringify(userFound)}`);
    return `User upserted: ${user.email}`;
    return 'Hello World!';
  }
}
