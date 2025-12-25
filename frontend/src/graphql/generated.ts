import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any };
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: { input: any; output: any };
};

export type AuthSession = {
  __typename?: 'AuthSession';
  expiresAt: Scalars['DateTime']['output'];
  me: User;
  token: Scalars['String']['output'];
};

export type HealthCheck = {
  __typename?: 'HealthCheck';
  services: Array<ServiceConnection>;
  status: Scalars['String']['output'];
  timestamp?: Maybe<Scalars['DateTime']['output']>;
};

export type LoginInput = {
  password: Scalars['String']['input'];
  userNameOrEmail: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: AuthSession;
  signup: AuthSession;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationSignupArgs = {
  input: SignupInput;
};

export type Query = {
  __typename?: 'Query';
  health: HealthCheck;
};

export type ServiceConnection = {
  __typename?: 'ServiceConnection';
  host?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  port?: Maybe<Scalars['Int']['output']>;
  status: Scalars['Boolean']['output'];
};

export type SignupInput = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  isPrivate: Scalars['Boolean']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  userId: Scalars['UUID']['output'];
  userName: Scalars['String']['output'];
};

export type HealthQueryVariables = Exact<{ [key: string]: never }>;

export type HealthQuery = {
  __typename?: 'Query';
  health: {
    __typename?: 'HealthCheck';
    status: string;
    timestamp?: any | null;
    services: Array<{
      __typename?: 'ServiceConnection';
      host?: string | null;
      name: string;
      port?: number | null;
      status: boolean;
    }>;
  };
};

export const HealthDocument = gql`
  query Health {
    health {
      status
      timestamp
      services {
        host
        name
        port
        status
      }
    }
  }
`;

/**
 * __useHealthQuery__
 *
 * To run a query within a React component, call `useHealthQuery` and pass it any options that fit your needs.
 * When your component renders, `useHealthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHealthQuery({
 *   variables: {
 *   },
 * });
 */
export function useHealthQuery(
  baseOptions?: Apollo.QueryHookOptions<HealthQuery, HealthQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<HealthQuery, HealthQueryVariables>(
    HealthDocument,
    options
  );
}
export function useHealthLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<HealthQuery, HealthQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<HealthQuery, HealthQueryVariables>(
    HealthDocument,
    options
  );
}
// @ts-ignore
export function useHealthSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    HealthQuery,
    HealthQueryVariables
  >
): Apollo.UseSuspenseQueryResult<HealthQuery, HealthQueryVariables>;
export function useHealthSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<HealthQuery, HealthQueryVariables>
): Apollo.UseSuspenseQueryResult<HealthQuery | undefined, HealthQueryVariables>;
export function useHealthSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<HealthQuery, HealthQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ?
      baseOptions
    : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<HealthQuery, HealthQueryVariables>(
    HealthDocument,
    options
  );
}
export type HealthQueryHookResult = ReturnType<typeof useHealthQuery>;
export type HealthLazyQueryHookResult = ReturnType<typeof useHealthLazyQuery>;
export type HealthSuspenseQueryHookResult = ReturnType<
  typeof useHealthSuspenseQuery
>;
export type HealthQueryResult = Apollo.QueryResult<
  HealthQuery,
  HealthQueryVariables
>;
