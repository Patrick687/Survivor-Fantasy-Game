import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import loadEnvConfig from './config';
import { PrismaModule } from './prisma/prisma.module';
import { SeedDataModule } from './prisma/seedData/seedData.module';
import { AuthModule } from './auth/auth.module';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'generated/graphql.ts',
      playground: true,
      definitions: {
        path: join(process.cwd(), 'generated/graphql.ts'),
        outputAs: 'class',
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [loadEnvConfig],
    }),
    PrismaModule,
    SeedDataModule,
    AuthModule,
  ],

  providers: [AppResolver],
})
export class AppModule {}
