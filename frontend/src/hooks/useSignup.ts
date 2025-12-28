import { useMutation } from '@apollo/client/react';
import { type SignupMutationVariables } from '../graphql/generated';
import { SIGNUP_MUTATION } from '../graphql/mutations/auth.mutations';

export default function useSignup() {
  const [doSignupMutation, { data, loading, error }] =
    useMutation(SIGNUP_MUTATION);

  async function doSignup(input: SignupMutationVariables['input']) {
    try {
      const result = await doSignupMutation({ variables: { input } });
      return result;
    } catch (err: unknown) {
      return null;
    }
  }

  return {
    doSignup,
    data,
    loading,
    error, // pass the raw error object
  };
}
