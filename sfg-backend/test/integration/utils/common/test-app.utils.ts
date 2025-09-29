import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../src/app.module';
import { PrismaService } from '../../../../src/prisma/prisma.service';

export interface TestAppSetup {
  app: INestApplication;
  prismaService: PrismaService;
}

export const setupTestApp = async (): Promise<TestAppSetup> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const prismaService = moduleFixture.get<PrismaService>(PrismaService);

  await app.init();

  return { app, prismaService };
};

export const teardownTestApp = async (
  app: INestApplication,
  prismaService: PrismaService,
) => {
  await prismaService.$disconnect();
  await app.close();
};
