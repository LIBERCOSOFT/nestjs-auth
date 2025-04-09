import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<GqlContext>();
    return gqlContext.req;
  }
}
