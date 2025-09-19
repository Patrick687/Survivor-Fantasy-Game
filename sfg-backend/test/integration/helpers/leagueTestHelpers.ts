import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { authHeader } from './authTestHelpers';

export async function createLeague(app: INestApplication, league: { name: string; seasonId: string; token: string; }) {
    const mutation = `
      mutation {
        createLeague(body: { name: "${league.name}", seasonId: "${league.seasonId}" }) {
          id
          name
          seasonId
        }
      }
    `;
    return request(app.getHttpServer())
        .post('/graphql')
        .set(authHeader(league.token))
        .send({ query: mutation });
}

export async function getLeague(app: INestApplication, id: string, token: string) {
    const query = `
      query {
        getLeague(id: "${id}") {
          id
          name
          seasonId
        }
      }
    `;
    return request(app.getHttpServer())
        .post('/graphql')
        .set(authHeader(token))
        .send({ query });
}

export async function getUserLeagues(app: INestApplication, token: string) {
    const query = `
      query {
        getUserLeagues {
          id
          name
          seasonId
        }
      }
    `;
    return request(app.getHttpServer())
        .post('/graphql')
        .set(authHeader(token))
        .send({ query });
}