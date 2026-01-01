import { gql, type TypedDocumentNode } from '@apollo/client';
import type {
  VerifySessionQuery,
  VerifySessionQueryVariables,
} from '../graphql/generated';

export const VERIFY_SESSION_QUERY: TypedDocumentNode<
  VerifySessionQuery,
  VerifySessionQueryVariables
> = gql`
  query VerifySession($input: VerifySessionInput!) {
    verifySession(input: $input) {
      token
      me {
        email
        firstName
        lastName
        userId
        userName
      }
    }
  }
`;
