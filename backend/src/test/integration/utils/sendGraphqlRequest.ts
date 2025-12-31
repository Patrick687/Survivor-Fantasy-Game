import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import request from 'supertest';

const sendGraphQLRequest = (
  app: INestApplication<Server>,
  query: string,
): request.Test =>
  request(app.getHttpServer()).post('/graphql').send({ query });

export default sendGraphQLRequest;
