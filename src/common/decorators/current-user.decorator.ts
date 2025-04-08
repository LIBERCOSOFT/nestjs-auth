import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface JwtUser {
  id: string;
  email: string;
  biometricKey?: string;
}

interface GqlContext {
  req: {
    user: JwtUser;
  };
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<GqlContext>();
    return gqlContext.req.user;
  },
);
