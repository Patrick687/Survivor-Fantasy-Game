import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SignupDto, LoginDto } from '../../../../generated/graphql';
import { PrismaService } from '../../../../src/prisma/prisma.service';
import { SIGNUP_MUTATION, LOGIN_MUTATION } from './auth.mutations';
import { cleanupTestUser } from './auth.cleanup';

export const runSignupMutation = async (
  app: INestApplication,
  {
    prismaService,
    cleanupInitial = true,
    cleanupAfter = false,
  }: {
    prismaService: PrismaService;
    cleanupInitial?: boolean;
    cleanupAfter?: boolean;
  },
  signupDto: SignupDto,
  mutation: string = SIGNUP_MUTATION,
) => {
  if (cleanupInitial) {
    const numDeleted = await cleanupTestUser(prismaService, signupDto.email);
  }

  const response = await request(app.getHttpServer())
    .post('/graphql')
    .send({
      query: mutation,
      variables: { data: signupDto },
    })
    .expect(200);

  if (cleanupAfter) {
    await cleanupTestUser(prismaService, signupDto.email);
  }

  return response;
};

export const runLoginMutation = async (
  app: INestApplication,
  loginDto: LoginDto,
  mutation: string = LOGIN_MUTATION,
) => {
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .send({
      query: mutation,
      variables: { data: loginDto },
    })
    .expect(200);

  return response;
};
