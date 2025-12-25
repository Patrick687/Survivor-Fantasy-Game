import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceConnection } from './health-check.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthCheckService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getHealthStatus(): Promise<ServiceConnection[]> {
    const databaseUrl = this.configService.getOrThrow<string>('databaseUrl');
    const { host, port } = this.extractHostAndPort(databaseUrl);

    let dbStatus = false;
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      dbStatus = true;
    } catch {
      dbStatus = false;
    }

    return [
      {
        name: `Database Connection ${dbStatus ? '✅' : '❌'}`,
        host,
        port,
        status: dbStatus,
      },
    ];
  }

  private extractHostAndPort(databaseUrl: string): {
    host: string;
    port: number;
  } {
    try {
      const url = new URL(databaseUrl.replace('postgresql://', 'http://'));
      if (!url) {
        throw new Error('Hmm... unable to parse URL');
      }
      return {
        host: url.hostname,
        port: Number(url.port),
      };
    } catch {
      return { host: 'unknown', port: 0 };
    }
  }
}
