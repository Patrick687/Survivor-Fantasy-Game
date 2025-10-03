import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { LeagueMemberRole } from '@prisma/client';

export interface CurrentLeagueContext {
  leagueId: string;
  role: LeagueMemberRole;
}

export const CurrentLeague = createParamDecorator(
  (data: unknown, context: ExecutionContext): CurrentLeagueContext => {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;
    return request.currentLeague;
  },
);
