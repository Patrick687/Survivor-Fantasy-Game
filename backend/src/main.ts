import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const logger = new ConsoleLogger({
    logLevels: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
    prefix: 'SFG Backend',
    json: false,
    colors: true,
    timestamp: false,
  });

  const app = await NestFactory.create(AppModule, {
    logger,
  });
  const configService = app.get(ConfigService);

  const host = configService.getOrThrow<string>('host');
  const port = configService.getOrThrow<number>('port');
  const node_env = configService.getOrThrow<string>('nodeEnv');

  await app
    .listen(port, host)
    .then(() => {
      logger.log(
        `${node_env.slice(0, 1).toLocaleUpperCase() + node_env.slice(1)} server started and listening on http://${host}:${port}`,
      );
    })
    .catch((err) => {
      logger.error('Failed to start server:', err);
      process.exit(1);
    });
}
void bootstrap();
