import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma';
import { YoasobiModule } from './yoasobi';
import { UtilModule } from './utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: '/pacakges/shared/graphql/schema.gql',
      playground: false,
    }),
    PrismaModule,
    UtilModule,
    YoasobiModule,
  ],
})
export class AppModule {}
