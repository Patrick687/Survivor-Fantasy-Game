import type { GraphQLError } from 'graphql';

export function getGraphQLErrorMessage(
  error: unknown,
  defaultMessage = 'Oops, something went wrong. Try again later.'
): string | undefined {
  if (!error) return undefined;
  if (typeof error === 'object' && 'graphQLErrors' in error) {
    const gqlErrors = (error as { graphQLErrors: GraphQLError[] })
      .graphQLErrors;
    if (gqlErrors && gqlErrors.length > 0) {
      return gqlErrors[0].message;
    } else if (
      'message' in error &&
      typeof (error as any).message === 'string'
    ) {
      return (error as any).message;
    }
    return defaultMessage;
  } else if (
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as any).message === 'string'
  ) {
    return (error as any).message;
  }
  return undefined;
}
