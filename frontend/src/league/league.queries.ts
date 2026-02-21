import { gql, type TypedDocumentNode } from '@apollo/client';
import { LEAGUE_FRAGMENT } from './league.fragments';
import type {
  GetMyLeaguesQuery,
  GetMyLeaguesQueryVariables,
} from '../graphql/generated';

export const GET_MY_LEAGUES_QUERY: TypedDocumentNode<
  GetMyLeaguesQuery,
  GetMyLeaguesQueryVariables
> = gql`
  query GetMyLeagues {
    getMyLeagues {
      ...LeagueFields
    }
  }
  ${LEAGUE_FRAGMENT}
`;
