import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import * as YoasobiResolvers from './resolvers';
import * as YoasobiServices from './services';

const Resolvers = Object.values(YoasobiResolvers);
const Services = Object.values(YoasobiServices);

@Module({
  providers: [...Resolvers, ...Services, PrismaService],
})
export class YoasobiModule {}
