import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from '../../auth/token/jwt-payload.type';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayload => {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;
    return request.user;
  },
);
