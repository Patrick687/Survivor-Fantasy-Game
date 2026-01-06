import { ApolloClient, gql } from '@apollo/client';
import { SignupInput } from 'src/auth/dto/signup.input';
import { Mutation } from 'test/integration/generated.types';
import { TestClient } from './TestClient';

const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      me {
        userId
        userName
        email
        firstName
        lastName
      }
    }
  }
`;

const DEFAULT_TEST_USER: SignupInput = {
  userName: 'test1User',
  email: 'test1@integrationtest.com',
  firstName: 'Jon',
  lastName: 'Doe',
  password: 'Asdf1234!',
  isPrivate: false,
};

export async function createTestUser(
  apolloClient: TestClient,
  userOverrides: Partial<SignupInput> = {},
): Promise<Mutation['signup']> {
  const userData = { ...DEFAULT_TEST_USER, ...userOverrides };

  const { data } = await apolloClient.client.mutate<Mutation>({
    mutation: SIGNUP_MUTATION,
    variables: { input: userData },
  });

  if (!data?.signup) throw new Error('Signup failed');
  expect(typeof data.signup.token).toBe('string');
  expect(data.signup.token.length).toBeGreaterThan(10);
  expect(data.signup.me.userId).toBeDefined();
  expect(data.signup.me.userName).toBe(userData.userName);
  expect(data.signup.me.email).toBe(userData.email);
  expect(data.signup.me.firstName).toBe(userData.firstName);
  expect(data.signup.me.lastName).toBe(userData.lastName);
  return data.signup;
}
