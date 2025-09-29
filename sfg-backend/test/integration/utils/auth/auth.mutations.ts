export const SIGNUP_MUTATION = `
  mutation Signup($data: SignupDto!) {
    signup(data: $data) {
      user {
        userId
        email
        role
        profile {
          id
          firstName
          lastName
          userName
          isPublic
        }
      }
      token
    }
  }
`;

export const LOGIN_MUTATION = `
  mutation Login($data: LoginDto!) {
    login(data: $data) {
      user {
        userId
        email
        role
        profile {
          id
          firstName
          lastName
          userName
          isPublic
        }
      }
      token
    }
  }
`;
