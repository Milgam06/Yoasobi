import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import * as AuthServices from './services';
import { AuthGuard } from './guards';

const Services = Object.values(AuthServices);

@Module({
  imports: [ConfigModule],
  providers: [...Services, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AuthModule {}
