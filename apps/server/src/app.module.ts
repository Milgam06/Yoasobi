import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma';
import { YoasobiModule } from './yoasobi';
import { UtilModule } from './utils';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(
        process.cwd(),
        '../../packages/shared/graphql/schema.gql',
      ),
      playground: false,
      context: ({ req }) => ({ req }),
    }),
    PrismaModule,
    UtilModule,
    UserModule,
    AuthModule,
    YoasobiModule,
  ],
})
export class AppModule {}
