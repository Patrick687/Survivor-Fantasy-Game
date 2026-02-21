import { gql } from '@apollo/client';

export const LEAGUE_FRAGMENT = gql`
  fragment LeagueFields on League {
    id
    name
    description
    createdAt
    updatedAt
    season
    createdBy {
      userId
      userName
      email
      firstName
      lastName
    }
    members {
      id
      joinedAt
      role
      invitedBy {
        id
        joinedAt
        role
        user {
          userId
          userName
          email
          firstName
          lastName
        }
      }
      user {
        userId
        userName
        email
        firstName
        lastName
      }
    }
  }
`;
