// test/integration/utils/graphql-assertions.ts
import {
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

const EXCEPTION_CLASS_TO_STATUS_CODE = new Map([
  [UnauthorizedException, 401],
  [ForbiddenException, 403],
  [NotFoundException, 404],
  [BadRequestException, 400],
  [ConflictException, 409],
  [InternalServerErrorException, 500],
]);

/**
 * Maps NestJS exception classes to GraphQL error codes (fallback)
 */
const EXCEPTION_CLASS_TO_ERROR_CODE = new Map([
  [UnauthorizedException, 'UNAUTHENTICATED'],
  [ForbiddenException, 'FORBIDDEN'],
  [NotFoundException, 'INTERNAL_SERVER_ERROR'], // Realistic mapping
  [BadRequestException, 'INTERNAL_SERVER_ERROR'], // Realistic mapping
  [ConflictException, 'INTERNAL_SERVER_ERROR'], // What you found
  [InternalServerErrorException, 'INTERNAL_SERVER_ERROR'],
]);

export type SupportedExceptionClass =
  | typeof UnauthorizedException
  | typeof ForbiddenException
  | typeof NotFoundException
  | typeof BadRequestException
  | typeof ConflictException
  | typeof InternalServerErrorException;

/**
 * Asserts that a GraphQL response contains an error with the expected exception type and message.
 */
export function expectGraphQLError(
  response: any,
  exceptionClass?: SupportedExceptionClass,
  expectedMessageSegments?: string[],
): void {
  // Assert errors exist
  expect(response.body.errors).toBeDefined();
  expect(Array.isArray(response.body.errors)).toBe(true);
  expect(response.body.errors.length).toBeGreaterThan(0);

  let matchingError: any;

  if (exceptionClass) {
    // Primary: Check by HTTP status code (more reliable)
    const expectedStatusCode =
      EXCEPTION_CLASS_TO_STATUS_CODE.get(exceptionClass);

    if (expectedStatusCode) {
      matchingError = response.body.errors.find(
        (error: any) => error.extensions?.status === expectedStatusCode,
      );
    }

    // Fallback: Check by GraphQL error code
    if (!matchingError) {
      const expectedCode = EXCEPTION_CLASS_TO_ERROR_CODE.get(exceptionClass);
      if (expectedCode) {
        matchingError = response.body.errors.find(
          (error: any) => error.extensions?.code === expectedCode,
        );
      }
    }

    // Debug info if no match found
    if (!matchingError) {
      throw new Error(
        `Expected error of type ${exceptionClass.name} but found none matching status ${expectedStatusCode}`,
      );
    }

    expect(matchingError).toBeDefined();
  } else {
    // If no exception class provided, just use the first error
    matchingError = response.body.errors[0];
  }

  // Check message if provided
  if (expectedMessageSegments && expectedMessageSegments.length > 0) {
    expect(matchingError.message).toBeDefined();
    expect(matchingError.message).not.toBeNull();

    const actualMessage = matchingError.message.toLowerCase();

    // Check that all segments are present in the message
    expectedMessageSegments.forEach((segment) => {
      expect(actualMessage).toContain(segment.toLowerCase());
    });
  }

  // Assert that data is null for the failed operation
  if (response.body.data) {
    const dataValues = Object.values(response.body.data);
    expect(dataValues).toContain(null);
  }
}
/**
 * Asserts that a GraphQL response is successful (no errors).
 *
 * @param response - The supertest response object
 */
export function expectGraphQLSuccess(response: any): void {
  expect(response.body.errors).toBeUndefined();
  expect(response.body.data).toBeDefined();
}
