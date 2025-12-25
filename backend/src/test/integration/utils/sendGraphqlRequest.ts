import { INestApplication } from '@nestjs/common';
import request from 'supertest';

const sendGraphQLRequest: (
  app: INestApplication,
  query: string,
) => request.Test = (app, query) =>
  request(app.getHttpServer()).post('/graphql').send({ query });

export default sendGraphQLRequest;
