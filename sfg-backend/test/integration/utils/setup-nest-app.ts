import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import request from 'supertest';
import {
  SignupDto,
  LoginDto,
  CreateLeagueDto,
  UserRole,
} from 'generated/graphql';
import { CreateSeasonDto } from 'src/season/dto/create-season.dto';
import { JwtPayload as PrismaJwtPayload } from 'src/auth/token/jwt-payload.type';

type TestAppServices = {
  prismaService: PrismaService;
};

export type TestJwtPayload = Omit<PrismaJwtPayload, 'userRole'> & {
  userRole: UserRole;
};

// Define the mutation/query variable types
export interface MutationVariables {
  signup: { data: SignupDto };
  login: { data: LoginDto };
  createSeason: { input: CreateSeasonDto };
  createLeague: { input: CreateLeagueDto };
  generateInviteCode: { leagueId: string; expiresInMinutes: number };
}

export interface QueryVariables {
  getMyLeagues: {};
}

export type TestApp = INestApplication & {
  mutation: <K extends keyof MutationVariables>(
    mutationString: string,
    variables: MutationVariables[K],
  ) => request.Test;

  query: <K extends keyof QueryVariables>(
    queryString: string,
    variables?: QueryVariables[K],
  ) => request.Test;

  setAuthToken: (token: string) => void;
  getAuthToken: () => string | null;
  getJwtPayload: () => TestJwtPayload | null;
  clearAuth: () => void;

  cleanup: () => Promise<void>;
};

async function createTestApp(): Promise<{
  app: TestApp;
  services: TestAppServices;
}> {
  if (!process.env.DATABASE_URL?.includes('sfg_test')) {
    throw new Error(
      `❌ Expected test database but got: ${process.env.DATABASE_URL}`,
    );
  }
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  // Store auth payload for authenticated requests
  let currentToken: string | null = null;

  const testAppServices: TestAppServices = getServices(app);
  const testApp = app as TestApp;

  testApp.mutation = <K extends keyof MutationVariables>(
    mutationString: string,
    variables: MutationVariables[K],
  ) => {
    const req = request(app.getHttpServer()).post('/graphql');

    // Add Authorization header if auth payload with token is set
    if (currentToken) {
      req.set('Authorization', `Bearer ${currentToken}`);
    }

    return req.send({ query: mutationString, variables });
  };

  testApp.query = <K extends keyof QueryVariables>(
    queryString: string,
    variables?: QueryVariables[K],
  ) => {
    const req = request(app.getHttpServer()).post('/graphql');

    // Add Authorization header if auth payload with token is set
    if (currentToken) {
      req.set('Authorization', `Bearer ${currentToken}`);
    }

    return req.send({ query: queryString, variables });
  };

  testApp.setAuthToken = (token: string) => {
    currentToken = token;
  };

  // Get current auth token
  testApp.getAuthToken = () => currentToken;

  // Decode JWT payload from the token
  testApp.getJwtPayload = (): TestJwtPayload | null => {
    if (!currentToken) {
      return null;
    }

    try {
      // Decode the JWT token to get the payload
      // This is a simple base64 decode - in production you'd verify the signature
      const tokenParts = currentToken.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid JWT token format');
      }

      const base64Payload = tokenParts[1];
      const decodedPayload = Buffer.from(base64Payload, 'base64').toString(
        'utf-8',
      );
      return JSON.parse(decodedPayload) as TestJwtPayload;
    } catch (error) {
      throw new Error(`Failed to decode JWT payload: ${error.message}`);
    }
  };

  testApp.clearAuth = () => {
    currentToken = null;
  };

  testApp.cleanup = async () => {
    await app.close();
  };

  return {
    app: testApp,
    services: testAppServices,
  };
}

function getServices(app: INestApplication): TestAppServices {
  const prismaService = app.get(PrismaService);
  return { prismaService };
}

export default createTestApp;
