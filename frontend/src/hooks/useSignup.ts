import { useMutation } from '@apollo/client/react';
import { type SignupMutationVariables } from '../graphql/generated';
import { SIGNUP_MUTATION } from '../graphql/mutations/auth.mutations';

export default function useSignup() {
  const [doSignupMutation, { data, loading, error }] =
    useMutation(SIGNUP_MUTATION);

  async function doSignup(
    input: SignupMutationVariables['input'],
    onValidationError?: (errors: Record<string, string>) => void
  ) {
    try {
      return await doSignupMutation({ variables: { input } });
    } catch (err: any) {
      console.log(err);
      const errorsArr = err.errors || err.graphQLErrors;
      if (Array.isArray(errorsArr) && errorsArr.length > 0) {
        const extensions = errorsArr[0].extensions;
        const validationErrors = extensions?.originalError?.validationErrors;
        if (
          extensions?.code === 'BAD_REQUEST' &&
          validationErrors &&
          typeof validationErrors === 'object'
        ) {
          // Flatten arrays to single string per field
          const flatErrors: Record<string, string> = {};
          Object.entries(validationErrors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              flatErrors[field] = messages[0]; // or join('\n') for all messages
            }
          });
          onValidationError?.(flatErrors);
          return null;
        }
      }
      console.log(
        'RAW GraphQL error object:',
        err,
        JSON.stringify(err, null, 2)
      );

      throw err;
    }
  }

  return { doSignup, data, loading, error };
}
