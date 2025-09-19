import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function createUser(app: INestApplication, user: { username?: string; email?: string; password?: string; }) {
  const mutation = `
      mutation {
        register(body: { username: "${user.username}", email: "${user.email}", password: "${user.password}" }) {
          user {
            id
            username
            email
          }
          token
        }
      }
    `;
  return request(app.getHttpServer())
    .post('/graphql')
    .send({ query: mutation });
}

export async function loginUser(app: INestApplication, credentials: { usernameOrEmail?: string; password?: string; }) {
  const mutation = `
      mutation {
        login(body: { usernameOrEmail: "${credentials.usernameOrEmail}", password: "${credentials.password}" }) {
          user {
            id
            username
            email
          }
          token
        }
      }
    `;
  return request(app.getHttpServer())
    .post('/graphql')
    .send({ query: mutation });
}