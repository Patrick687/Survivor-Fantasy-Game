import { Resolver, Query, ObjectType, Field } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';

@ObjectType()
class HealthCheckResult {
    @Field()
    status: string;

    @Field()
    environment: string;

    @Field()
    timestamp: string;
}

@Resolver()
export class AppResolver {
    constructor(private readonly configService: ConfigService) { }

    @Query(() => HealthCheckResult)
    healthCheck(): HealthCheckResult {
        return {
            status: 'OK',
            environment: this.configService.get('node_env') || 'unknown',
            timestamp: new Date().toISOString(),
        };
    }
}