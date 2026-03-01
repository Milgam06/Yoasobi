import { Module } from '@nestjs/common';
import * as UserServices from './services';
import * as UserResolvers from './resolvers';
import { PrismaService } from 'src/prisma';

const Resolvers = Object.values(UserResolvers);
const Services = Object.values(UserServices);

@Module({
  providers: [...Resolvers, ...Services, PrismaService],
})
export class UserModule {}
