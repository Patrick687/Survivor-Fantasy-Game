import { gql, type TypedDocumentNode } from '@apollo/client';
import { LEAGUE_FRAGMENT } from './league.fragments';
import type {
  CreateLeagueMutation,
  CreateLeagueMutationVariables,
} from '../graphql/generated';

export const CREATE_LEAGUE_MUTATION: TypedDocumentNode<
  CreateLeagueMutation,
  CreateLeagueMutationVariables
> = gql`
  mutation CreateLeague($input: CreateLeagueInput!) {
    createLeague(input: $input) {
      ...LeagueFields
    }
  }
  ${LEAGUE_FRAGMENT}
`;
