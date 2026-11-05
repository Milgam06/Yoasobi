import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IAuthRequest } from '../auth.types';
import { SupabaseAuthService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabaseAuthService: SupabaseAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req } = GqlExecutionContext.create(context).getContext<{
      req: IAuthRequest;
    }>();
    const authorization = req?.headers?.authorization;
    const token =
      typeof authorization === 'string'
        ? /^Bearer\s+(\S+)$/i.exec(authorization)?.[1]
        : undefined;
    if (!token) {
      throw new UnauthorizedException('Access token required');
    }
    req.user = await this.supabaseAuthService.execute(token);
    return true;
  }
}
