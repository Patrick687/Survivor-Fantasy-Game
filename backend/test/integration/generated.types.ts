import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: { input: any; output: any; }
};

export type AuthSession = {
  __typename?: 'AuthSession';
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
  __typename?: 'HealthCheck';
  services: Array<ServiceConnection>;
  status: Scalars['String']['output'];
  timestamp?: Maybe<Scalars['DateTime']['output']>;
};

export type League = {
  __typename?: 'League';
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  members: Array<LeagueMember>;
  name: Scalars['String']['output'];
  season: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
};

export type LeagueInviteCode = {
  __typename?: 'LeagueInviteCode';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: LeagueMember;
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  league: League;
  revokedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LeagueMember = {
  __typename?: 'LeagueMember';
  id: Scalars['String']['output'];
  invitedBy?: Maybe<LeagueMember>;
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
  __typename?: 'Mutation';
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
  __typename?: 'Query';
  getMyLeagues: Array<League>;
  health: HealthCheck;
  verifySession: AuthSession;
};


export type QueryVerifySessionArgs = {
  input: VerifySessionInput;
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

export type VerifySessionInput = {
  token: Scalars['String']['input'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthSession: ResolverTypeWrapper<AuthSession>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateLeagueInput: CreateLeagueInput;
  CreateLeagueInviteCodeInput: CreateLeagueInviteCodeInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  HealthCheck: ResolverTypeWrapper<HealthCheck>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  League: ResolverTypeWrapper<League>;
  LeagueInviteCode: ResolverTypeWrapper<LeagueInviteCode>;
  LeagueMember: ResolverTypeWrapper<LeagueMember>;
  LeagueRole: LeagueRole;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  ServiceConnection: ResolverTypeWrapper<ServiceConnection>;
  SignupInput: SignupInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UUID: ResolverTypeWrapper<Scalars['UUID']['output']>;
  User: ResolverTypeWrapper<User>;
  VerifySessionInput: VerifySessionInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthSession: AuthSession;
  Boolean: Scalars['Boolean']['output'];
  CreateLeagueInput: CreateLeagueInput;
  CreateLeagueInviteCodeInput: CreateLeagueInviteCodeInput;
  DateTime: Scalars['DateTime']['output'];
  HealthCheck: HealthCheck;
  Int: Scalars['Int']['output'];
  League: League;
  LeagueInviteCode: LeagueInviteCode;
  LeagueMember: LeagueMember;
  LoginInput: LoginInput;
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  ServiceConnection: ServiceConnection;
  SignupInput: SignupInput;
  String: Scalars['String']['output'];
  UUID: Scalars['UUID']['output'];
  User: User;
  VerifySessionInput: VerifySessionInput;
};

export type AuthSessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthSession'] = ResolversParentTypes['AuthSession']> = {
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type HealthCheckResolvers<ContextType = any, ParentType extends ResolversParentTypes['HealthCheck'] = ResolversParentTypes['HealthCheck']> = {
  services?: Resolver<Array<ResolversTypes['ServiceConnection']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type LeagueResolvers<ContextType = any, ParentType extends ResolversParentTypes['League'] = ResolversParentTypes['League']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['LeagueMember']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  season?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type LeagueInviteCodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeagueInviteCode'] = ResolversParentTypes['LeagueInviteCode']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['LeagueMember'], ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  league?: Resolver<ResolversTypes['League'], ParentType, ContextType>;
  revokedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type LeagueMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeagueMember'] = ResolversParentTypes['LeagueMember']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  invitedBy?: Resolver<Maybe<ResolversTypes['LeagueMember']>, ParentType, ContextType>;
  joinedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  league?: Resolver<ResolversTypes['League'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['LeagueRole'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createLeague?: Resolver<ResolversTypes['League'], ParentType, ContextType, RequireFields<MutationCreateLeagueArgs, 'input'>>;
  createLeagueInviteCode?: Resolver<ResolversTypes['LeagueInviteCode'], ParentType, ContextType, RequireFields<MutationCreateLeagueInviteCodeArgs, 'input'>>;
  login?: Resolver<ResolversTypes['AuthSession'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  signup?: Resolver<ResolversTypes['AuthSession'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'input'>>;
  useLeagueInviteCode?: Resolver<ResolversTypes['League'], ParentType, ContextType, RequireFields<MutationUseLeagueInviteCodeArgs, 'inviteCode'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getMyLeagues?: Resolver<Array<ResolversTypes['League']>, ParentType, ContextType>;
  health?: Resolver<ResolversTypes['HealthCheck'], ParentType, ContextType>;
  verifySession?: Resolver<ResolversTypes['AuthSession'], ParentType, ContextType, RequireFields<QueryVerifySessionArgs, 'input'>>;
};

export type ServiceConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ServiceConnection'] = ResolversParentTypes['ServiceConnection']> = {
  host?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  port?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  userName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthSession?: AuthSessionResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  HealthCheck?: HealthCheckResolvers<ContextType>;
  League?: LeagueResolvers<ContextType>;
  LeagueInviteCode?: LeagueInviteCodeResolvers<ContextType>;
  LeagueMember?: LeagueMemberResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ServiceConnection?: ServiceConnectionResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
};

