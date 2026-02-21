export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: unknown; output: unknown; }
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: { input: unknown; output: unknown; }
};

export type AuthSession = {
  __typename: 'AuthSession';
  me: User;
  token: Scalars['String']['output'];
};

export type CreateLeagueInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  seasonId: Scalars['Int']['input'];
};

export type CreateLeagueInviteCodeInput = {
  leagueId: Scalars['String']['input'];
};

export type HealthCheck = {
  __typename: 'HealthCheck';
  services: Array<ServiceConnection>;
  status: Scalars['String']['output'];
  timestamp: Maybe<Scalars['DateTime']['output']>;
};

export type League = {
  __typename: 'League';
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  members: Array<LeagueMember>;
  name: Scalars['String']['output'];
  season: Scalars['Int']['output'];
  updatedAt: Maybe<Scalars['DateTime']['output']>;
  updatedBy: Maybe<User>;
};

export type LeagueInviteCode = {
  __typename: 'LeagueInviteCode';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: LeagueMember;
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  league: League;
  revokedAt: Maybe<Scalars['DateTime']['output']>;
};

export type LeagueMember = {
  __typename: 'LeagueMember';
  id: Scalars['String']['output'];
  invitedBy: Maybe<LeagueMember>;
  joinedAt: Scalars['DateTime']['output'];
  league: League;
  role: LeagueRole;
  user: User;
};

/** Roles assigned to league members */
export enum LeagueRole {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Owner = 'OWNER'
}

export type LoginInput = {
  password: Scalars['String']['input'];
  userNameOrEmail: Scalars['String']['input'];
};

export type Mutation = {
  __typename: 'Mutation';
  createLeague: League;
  createLeagueInviteCode: LeagueInviteCode;
  login: AuthSession;
  signup: AuthSession;
  useLeagueInviteCode: League;
};


export type MutationCreateLeagueArgs = {
  input: CreateLeagueInput;
};


export type MutationCreateLeagueInviteCodeArgs = {
  input: CreateLeagueInviteCodeInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSignupArgs = {
  input: SignupInput;
};


export type MutationUseLeagueInviteCodeArgs = {
  inviteCode: Scalars['String']['input'];
};

export type Query = {
  __typename: 'Query';
  getMyLeagues: Array<League>;
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


export type LoginMutation = { login: { __typename: 'AuthSession', token: string, me: { __typename: 'User', email: string, firstName: string | null, lastName: string | null, userId: unknown, userName: string } } };

export type SignupMutationVariables = Exact<{
  input: SignupInput;
}>;


export type SignupMutation = { signup: { __typename: 'AuthSession', token: string, me: { __typename: 'User', email: string, firstName: string | null, lastName: string | null, userId: unknown, userName: string } } };

export type VerifySessionQueryVariables = Exact<{
  input: VerifySessionInput;
}>;


export type VerifySessionQuery = { verifySession: { __typename: 'AuthSession', token: string, me: { __typename: 'User', email: string, firstName: string | null, lastName: string | null, userId: unknown, userName: string } } };

export type LeagueFieldsFragment = { __typename: 'League', id: string, name: string, description: string | null, createdAt: unknown, updatedAt: unknown | null, season: number, createdBy: { __typename: 'User', userId: unknown, userName: string, email: string, firstName: string | null, lastName: string | null }, members: Array<{ __typename: 'LeagueMember', id: string, joinedAt: unknown, role: LeagueRole, invitedBy: { __typename: 'LeagueMember', id: string, joinedAt: unknown, role: LeagueRole, user: { __typename: 'User', userId: unknown, userName: string, email: string, firstName: string | null, lastName: string | null } } | null, user: { __typename: 'User', userId: unknown, userName: string, email: string, firstName: string | null, lastName: string | null } }> };

export type CreateLeagueMutationVariables = Exact<{
  input: CreateLeagueInput;
}>;


export type CreateLeagueMutation = { createLeague: { __typename: 'League', id: string, name: string, description: string | null, createdAt: unknown, updatedAt: unknown | null, season: number, createdBy: { __typename: 'User', userId: unknown, userName: string, email: string, firstName: string | null, lastName: string | null }, members: Array<{ __typename: 'LeagueMember', id: string, joinedAt: unknown, role: LeagueRole, invitedBy: { __typename: 'LeagueMember', id: string, joinedAt: unknown, role: LeagueRole, user: { __typename: 'User', userId: unknown, userName: string, email: string, firstName: string | null, lastName: string | null } } | null, user: { __typename: 'User', userId: unknown, userName: string, email: string, firstName: string | null, lastName: string | null } }> } };

export type GetMyLeaguesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyLeaguesQuery = { getMyLeagues: Array<{ __typename: 'League', id: string, name: string, description: string | null, createdAt: unknown, updatedAt: unknown | null, season: number, createdBy: { __typename: 'User', userId: unknown, userName: string, email: string, firstName: string | null, lastName: string | null }, members: Array<{ __typename: 'LeagueMember', id: string, joinedAt: unknown, role: LeagueRole, invitedBy: { __typename: 'LeagueMember', id: string, joinedAt: unknown, role: LeagueRole, user: { __typename: 'User', userId: unknown, userName: string, email: string, firstName: string | null, lastName: string | null } } | null, user: { __typename: 'User', userId: unknown, userName: string, email: string, firstName: string | null, lastName: string | null } }> }> };
