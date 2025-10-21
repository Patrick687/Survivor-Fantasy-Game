export const getMyLeaguesQuery = `
query GetMyLeagues {
    getMyLeagues {
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
                profile {
                    userName
                    id
                    firstName
                    isPublic
                    lastName
                }
                userId
                email
                role
            }
        }
    }
}
`;
