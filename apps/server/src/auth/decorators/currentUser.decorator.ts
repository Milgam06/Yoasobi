import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IAuthRequest, ICurrentUser } from '../auth.types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ICurrentUser => {
    const { req } = GqlExecutionContext.create(context).getContext<{
      req: IAuthRequest;
    }>();
    if (!req?.user) {
      throw new UnauthorizedException('Authenticated user required');
    }
    return req.user;
  },
);
