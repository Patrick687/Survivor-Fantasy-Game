import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedAllDataService } from './prisma/seedData/seedAllData.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const serverPort = configService.getOrThrow<number>('port');

    await app.get(SeedAllDataService).runSeed();

    Logger.log(`Application is running on: http://localhost:${serverPort}`);
    await app.listen(serverPort);
  } catch (error) {
    console.error('Error during application bootstrap:', error);
  }

}
bootstrap();