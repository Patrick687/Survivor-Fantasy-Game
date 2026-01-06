import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();

    // await this.season.upsert({
    //   where: {
    //     id: 47,
    //     name: 'Season 47',
    //     location: 'Philippines',
    //   },
    //   update: {},
    //   create: {
    //     id: 47,
    //     name: 'Season 47',
    //     location: 'Philippines',
    //   },
    // });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
