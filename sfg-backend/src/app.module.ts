import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import loadEnvConfig from './config';
import { AuthModule } from './auth/auth.module';
import { SeasonModule } from './season/season.module';
import { LeagueModule } from './league/league.module';
import { DateScalar } from './graphql/schemas/dateScalar';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/graphql/schemas/schema.gql',
      typePaths: ['./**/*.gql'],
      playground: true,
      definitions: {
        //path: join(__dirname, './graphql/schemas/**/*.gql'),
        path: join(process.cwd(), 'src/graphql/graphql.ts'),
        outputAs: 'class'
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [loadEnvConfig]
    }),
    AuthModule,
    SeasonModule,
    LeagueModule
  ],
  providers: [DateScalar]
})
export class AppModule { }
