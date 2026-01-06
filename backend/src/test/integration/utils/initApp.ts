import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { TestClient } from './TestClient';
import { JwtService } from 'src/auth/jwt/jwt.service';

async function initApp(app?: INestApplication): Promise<{
  app: INestApplication;
  testClient: TestClient;
  prisma: PrismaService;
  jwtService: JwtService;
  port: number;
}> {
  if (app) await app.close();
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleFixture.createNestApplication();
  await app.init();
  await app.listen(0);

  const address = app.getHttpServer().address();
  const port =
    typeof address === 'string'
      ? parseInt(address.split(':').pop()!, 10)
      : address.port;

  const baseUrl = `http://localhost:${port}/graphql`;
  const testClient = new TestClient(baseUrl);
  const prisma = app.get<PrismaService>(PrismaService);
  const jwtService = app.get<JwtService>(JwtService);

  return {
    app,
    testClient,
    prisma,
    jwtService,
    port,
  };
}

export default initApp;
