import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, isAuthRetryableFetchError } from '@supabase/supabase-js';
import { isUUID } from 'class-validator';
import { ICurrentUser } from '../auth.types';

@Injectable()
export class SupabaseAuthService {
  private readonly supabase;
  private readonly issuer: string;

  constructor(configService: ConfigService) {
    const url = configService.getOrThrow<string>('SUPABASE_URL');
    const key = configService.getOrThrow<string>('SUPABASE_KEY');
    this.issuer = `${url.replace(/\/$/, '')}/auth/v1`;
    this.supabase = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  async execute(token: string): Promise<ICurrentUser> {
    const { data, error } = await this.supabase.auth
      .getClaims(token)
      .catch(() => {
        throw new ServiceUnavailableException(
          'Authentication service unavailable',
        );
      });

    if (error && (isAuthRetryableFetchError(error) || error.status >= 500)) {
      throw new ServiceUnavailableException(
        'Authentication service unavailable',
      );
    }

    if (error || !data) {
      throw new UnauthorizedException('Invalid access token');
    }

    const { claims } = data;
    const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud];

    if (
      claims.iss !== this.issuer ||
      !audience.includes('authenticated') ||
      typeof claims.sub !== 'string' ||
      !isUUID(claims.sub) ||
      typeof claims.exp !== 'number' ||
      !Number.isFinite(claims.exp)
    ) {
      throw new UnauthorizedException('Invalid access token');
    }
    return { id: claims.sub };
  }
}
