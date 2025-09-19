
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum LeagueInviteStatus {
    ACCEPTED = "ACCEPTED",
    PENDING = "PENDING",
    DECLINED = "DECLINED"
}

export enum LeagueMemberRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}

export class RegisterInput {
    username: string;
    password: string;
    email: string;
}

export class LoginInput {
    usernameOrEmail: string;
    password: string;
}

export class CreateLeagueInput {
    name: string;
    seasonId: string;
}

export class User {
    id: string;
    username: string;
    email: string;
}

export class AuthPayload {
    user?: Nullable<User>;
    token: string;
}

export abstract class IQuery {
    abstract me(): Nullable<User> | Promise<Nullable<User>>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract getLeague(id: string): League | Promise<League>;

    abstract getUserLeagues(): League[] | Promise<League[]>;

    abstract getAllSeasons(): Season[] | Promise<Season[]>;
}

export class League {
    id: string;
    name: string;
    seasonId: string;
    pendingLeagueInvites: LeagueInvite[];
    leagueMembers: LeagueMember[];
    leagueOwner: LeagueMember;
    leagueAdmins: LeagueMember[];
}

export class LeagueInvite {
    invitedUser: User;
    inviterMember: LeagueMember;
    status: LeagueInviteStatus;
    respondedOn?: Nullable<Date>;
}

export class LeagueMember {
    id: string;
    user: User;
    userId: string;
    league: League;
    leagueId: string;
    createdAt: string;
}

export class Season {
    id: string;
    name: string;
    startDate?: Nullable<string>;
    endDate?: Nullable<string>;
}

export abstract class IMutation {
    abstract register(body: RegisterInput): Nullable<AuthPayload> | Promise<Nullable<AuthPayload>>;

    abstract login(body: LoginInput): Nullable<AuthPayload> | Promise<Nullable<AuthPayload>>;

    abstract createLeague(body: CreateLeagueInput): Nullable<League> | Promise<Nullable<League>>;
}

type Nullable<T> = T | null;
