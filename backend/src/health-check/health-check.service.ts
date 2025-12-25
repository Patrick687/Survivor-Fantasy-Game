import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceConnection } from './health-check.entity';

function extractHostAndPort(databaseUrl: string): {
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

@Injectable()
export class HealthCheckService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHealthStatus(): Promise<ServiceConnection[]> {
    const databaseUrl = process.env.DATABASE_URL || '';
    const { host, port } = extractHostAndPort(databaseUrl);

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
}
