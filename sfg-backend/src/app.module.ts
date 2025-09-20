import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import loadEnvConfig from './config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { SeedDataModule } from './prisma/seedData/seedData.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/graphql/schemas/schema.gql',
      playground: true,
      definitions: {
        path: join(process.cwd(), 'generated/graphql.ts'),
        outputAs: 'class'
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [loadEnvConfig]
    }),
    PrismaModule,
    SeedDataModule,
    UserModule
  ],
})
export class AppModule { }
