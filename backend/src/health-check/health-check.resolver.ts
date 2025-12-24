import { Resolver, Query, ResolveField } from '@nestjs/graphql';
import { HealthCheck, ServiceConnection } from './health-check.entity';
import { HealthCheckService } from './health-check.service';
import { BadRequestError } from 'src/common/error/operational-error';

@Resolver(() => HealthCheck)
export class HealthCheckResolver {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Query(() => HealthCheck, { name: 'UhOh', nullable: true })
  uhOhCheck(): HealthCheck {
    // throw new InternalServerError();
    throw new BadRequestError('Testing a bad request error');
  }

  @Query(() => HealthCheck, { name: 'health' })
  healthCheck(): HealthCheck {
    return {
      status: 'OK',
      timestamp: new Date(),
    };
  }

  @ResolveField(() => [ServiceConnection], { name: 'services' })
  async services(): Promise<ServiceConnection[]> {
    return await this.healthCheckService.getHealthStatus();
  }
}

// Optional: ServiceConnectionResolver for future computed fields
@Resolver(() => ServiceConnection)
export class ServiceConnectionResolver {
  // Add @ResolveField methods here if you want to compute fields on ServiceConnection
}
