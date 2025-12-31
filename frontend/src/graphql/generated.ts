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
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: unknown; output: unknown };
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: { input: unknown; output: unknown };
};

export type AuthSession = {
  __typename: 'AuthSession';
  me: User;
  token: Scalars['String']['output'];
};

export type HealthCheck = {
  __typename: 'HealthCheck';
  services: Array<ServiceConnection>;
  status: Scalars['String']['output'];
  timestamp: Maybe<Scalars['DateTime']['output']>;
};

export type LoginInput = {
  password: Scalars['String']['input'];
  userNameOrEmail: Scalars['String']['input'];
};

export type Mutation = {
  __typename: 'Mutation';
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
  __typename: 'Query';
  health: HealthCheck;
  verifySession: AuthSession;
};

export type QueryVerifySessionArgs = {
  input: VerifySessionInput;
};

export type ServiceConnection = {
  __typename: 'ServiceConnection';
  host: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  port: Maybe<Scalars['Int']['output']>;
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
  __typename: 'User';
  email: Scalars['String']['output'];
  firstName: Maybe<Scalars['String']['output']>;
  lastName: Maybe<Scalars['String']['output']>;
  userId: Scalars['UUID']['output'];
  userName: Scalars['String']['output'];
};

export type VerifySessionInput = {
  token: Scalars['String']['input'];
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;

export type LoginMutation = {
  login: {
    __typename: 'AuthSession';
    token: string;
    me: {
      __typename: 'User';
      email: string;
      firstName: string | null;
      lastName: string | null;
      userId: unknown;
      userName: string;
    };
  };
};

export type SignupMutationVariables = Exact<{
  input: SignupInput;
}>;

export type SignupMutation = {
  signup: {
    __typename: 'AuthSession';
    token: string;
    me: {
      __typename: 'User';
      email: string;
      firstName: string | null;
      lastName: string | null;
      userId: unknown;
      userName: string;
    };
  };
};
