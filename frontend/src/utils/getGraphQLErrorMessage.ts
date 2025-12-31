/* eslint-disable */
import { CombinedGraphQLErrors } from '@apollo/client';
import type { GraphQLError } from 'graphql';

/**
 * Extracts the most descriptive error message(s) from Apollo/NestJS GraphQL errors.
 * Handles:
 *   - NestJS ValidationPipe (array of messages)
 *   - ConflictException and other string messages
 *   - Fallback to top-level GraphQL error message
 *   - Fallback to default message
 */

export function getGraphQLErrorMessage(
  error: unknown,
  defaultMessage = 'Oops, something went wrong. Try again later.'
): string | undefined {
  // --- Reference: Example error shapes below ---
  /**
   * This is an example of a ValidationPipe error being thrown BEFORE reaching the resolver. THis is a validation error.
   * getGraphQLErrorMessage: { ... }
   */
  /** THis is an example of an Exception being thrown WITHIN the resolver. THis is an operational error from the business logic.
   * ...
   */

  // Log for debugging (optional, comment out in production)
  // console.log('Error received in getGraphQLErrorMessage:', JSON.stringify(error, null, 2));

  if (!error) return undefined;

  // Apollo 3+ CombinedGraphQLErrors (multiple errors)
  if (CombinedGraphQLErrors.is(error)) {
    const errors = error.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      // Only handle the first error for now (could be extended to join all)
      const first = errors[0];
      const orig = first?.extensions?.originalError;
      const messages = orig?.message;
      if (Array.isArray(messages)) {
        return messages.join('\n');
      } else if (typeof messages === 'string') {
        return messages;
      }
      if (typeof first.message === 'string' && first.message.trim()) {
        return first.message;
      }
    }
    return defaultMessage;
  }

  // Apollo error shape: { graphQLErrors: GraphQLError[] }
  if (typeof error === 'object' && error !== null && 'graphQLErrors' in error) {
    const gqlErrors = (error as { graphQLErrors: GraphQLError[] })
      .graphQLErrors;
    if (Array.isArray(gqlErrors) && gqlErrors.length > 0) {
      const first = gqlErrors[0] as any;
      const orig = first?.extensions?.originalError;
      const messages = orig?.message;
      if (Array.isArray(messages)) {
        return messages.join('\n');
      } else if (typeof messages === 'string') {
        return messages;
      }
      if (typeof first.message === 'string' && first.message.trim()) {
        return first.message;
      }
    }
    if ('message' in error && typeof (error as any).message === 'string') {
      return (error as any).message;
    }
    return defaultMessage;
  }

  // Fallback: error.message at root
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  ) {
    return (error as any).message;
  }

  return defaultMessage;
}
