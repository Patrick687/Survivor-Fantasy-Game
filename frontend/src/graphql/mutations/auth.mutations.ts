import { gql, type TypedDocumentNode } from '@apollo/client';
import type {
  LoginMutation,
  LoginMutationVariables,
  SignupMutation,
  SignupMutationVariables,
} from '../generated';

export const LOGIN_MUTATION: TypedDocumentNode<
  LoginMutation,
  LoginMutationVariables
> = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
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

export const SIGNUP_MUTATION: TypedDocumentNode<
  SignupMutation,
  SignupMutationVariables
> = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
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
