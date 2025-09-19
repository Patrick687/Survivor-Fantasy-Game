import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { authHeader } from './authTestHelpers';

export async function getLeagueMembers(app: INestApplication, leagueId: string, token: string) {
    const query = `
      query {
        getLeague(id: "${leagueId}") {
          id
          name
          leagueMembers {
            id
            user {
              id
              username
            }
            league {
              id
              name
            }
            role
          }
        }
      }
    `;
    return request(app.getHttpServer())
        .post('/graphql')
        .set(authHeader(token))
        .send({ query });
}