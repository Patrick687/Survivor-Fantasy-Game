import { LOGIN_MUTATION } from '../graphql/mutations/auth.mutations';
import { useMutation } from '@apollo/client/react';
import type { LoginMutationVariables } from '../graphql/generated';
import { getGraphQLErrorMessage } from '../utils/getGraphQLErrorMessage';

export default function useLogin() {
  const [doLoginMutation, { data, loading, error }] =
    useMutation(LOGIN_MUTATION);

  async function doLogin(input: LoginMutationVariables['input']) {
    try {
      const result = await doLoginMutation({ variables: { input } });
      return result;
    } catch (err: unknown) {
      return null;
    }
  }

  return {
    doLogin,
    data,
    loading,
    error: getGraphQLErrorMessage(
      error,
      'Login Failed. Please Try Again Later.'
    ),
  };
}
