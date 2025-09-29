import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export async function runRequest(
  app: INestApplication,
  { query, variables }: { query: string; variables?: any },
  expectedStatusCode: number = 200,
) {
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .send({ query: query, variables: variables })
    .expect(expectedStatusCode);
  return response;
}
