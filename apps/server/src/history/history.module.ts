import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import * as HistoryResolvers from './resolvers';
import * as HistoryServices from './services';

const Resolvers = Object.values(HistoryResolvers);
const Services = Object.values(HistoryServices);

@Module({
  providers: [...Resolvers, ...Services, PrismaService],
})
export class HistoryModule {}
