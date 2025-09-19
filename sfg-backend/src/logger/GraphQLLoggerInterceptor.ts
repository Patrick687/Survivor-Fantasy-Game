import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class GraphQLLoggerInterceptor implements NestInterceptor {
    private readonly logger = new Logger('GraphQL');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.getArgByIndex(2); // GraphQL context
        const info = ctx?.info;
        if (info) {
            this.logger.log(`GraphQL Request: ${info.parentType.name}.${info.fieldName}`);
        }
        return next.handle();
    }
}