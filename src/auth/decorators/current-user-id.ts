import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayloadWithRefreshToken } from '../types/types';

export const CurrentUserId = createParamDecorator(
  (
    data: keyof JwtPayloadWithRefreshToken | undefined,
    context: ExecutionContext,
  ) => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    return req.user['userId'];
  },
);
