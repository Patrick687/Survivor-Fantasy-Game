export const signupMutation = `
    mutation Signup($data: SignupDto!) {
        signup(data: $data) {
            token
            user {
                userId
                email
                role
                profile {
                    id
                    firstName
                    lastName
                    isPublic
                    userName
                }
            }
        }
    }
`;

export const loginMutation = `
      mutation Login($data: LoginDto!) {
        login(data: $data) {
          token
          user {
            userId
            email
            role
            profile {
              id
              firstName
              lastName
              isPublic
              userName
            }
          }
        }
      }`;

export const createSeasonMutation = `
      mutation CreateSeason($input: CreateSeasonDto!) {
        createSeason(input: $input) {
            seasonId
            filmingLocation
            airStartDate
            airEndDate
          }
      }
`;

export const createLeagueMutation = `
  Mutation CreateLeague($input: CreateLeagueDto!) {
    createLeague(input: $input) {
        leagueId
        leagueName
        createdAt
        season {
            seasonId
            filmingLocation
            airStartDate
            airEndDate
        }
        createdBy {
            id
            role
            user {
                userId
                email
                role
                profile {
                    id
                    firstName
                    lastName
                    isPublic
                    userName
                }
            }
        }
      members {
            id
            role
            user {
                userId
                email
                role
                profile {
                    id
                    firstName
                    lastName
                    isPublic
                    userName
                }
            }
        }
    }
  }
`;
