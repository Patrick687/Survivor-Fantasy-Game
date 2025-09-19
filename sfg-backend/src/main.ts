import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import loadEnvConfig from './config';
import { GraphQLLoggerInterceptor } from './logger/GraphQLLoggerInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.setGlobalPrefix('api'); // All routes will be prefixed with /api

  const config = loadEnvConfig();

  app.useGlobalInterceptors(new GraphQLLoggerInterceptor());

  await app.listen(config.port, config.host);
}
bootstrap();
