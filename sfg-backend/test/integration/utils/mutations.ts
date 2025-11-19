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
  mutation CreateLeague($input: CreateLeagueDto!) {
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

export const generateInviteCodeMutation = `
  mutation GenerateInviteCode($leagueId: String!, $expiresInMinutes: Float!) {
    generateInviteCode(leagueId: $leagueId, expiresInMinutes: $expiresInMinutes)
  }
`;

export const createEpisodeMutation = `
  mutation CreateEpisode($data: CreateEpisodeDto!) {
    createEpisode(data: $data) {
      seasonId
      episodeNumber
      title
      airDate
      createdAt
      updatedAt
    }
  }
`;

export const updateEpisodeMutation = `
  mutation UpdateEpisode($data: UpdateEpisodeDto!) {
    updateEpisode(data: $data) {
      seasonId
      episodeNumber
      title
      airDate
      createdAt
      updatedAt
    }
  }
`;

export const deleteEpisodeMutation = `
  mutation DeleteEpisode($seasonId: Int!, $episodeNumber: Int!) {
    deleteEpisode(seasonId: $seasonId, episodeNumber: $episodeNumber)
  }
`;
