import { INestApplication } from '@nestjs/common';
import request from 'supertest';

const sendGraphQLRequest = (
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app: INestApplication,
  query: string,
): request.Test =>
  request(app.getHttpServer()).post('/graphql').send({ query });

export default sendGraphQLRequest;
