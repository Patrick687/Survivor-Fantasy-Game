import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({} as any); // Pass an empty object if required by your Prisma version
  }
}
