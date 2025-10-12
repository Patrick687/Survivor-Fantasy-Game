
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
}

export enum LeagueMemberRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}

export class SignupDto {
    email: string;
    password: string;
    userName: string;
    firstName: string;
    lastName?: Nullable<string>;
}

export class LoginDto {
    userNameOrEmail: string;
    password: string;
}

export class UpdateMemberRoleDto {
    leagueId: string;
    targetUserId: string;
    newRole: LeagueMemberRole;
}

export class CreateLeagueDto {
    seasonId: number;
    name: string;
}

export class CreateSeasonDto {
    seasonId: number;
    filmingLocation?: Nullable<string>;
    airStartDate?: Nullable<string>;
    airEndDate?: Nullable<string>;
}

export class UpdateSeasonDto {
    filmingLocation?: Nullable<string>;
    airStartDate?: Nullable<string>;
    airEndDate?: Nullable<string>;
}

export class User {
    userId: string;
    email: string;
    role: UserRole;
    profile: Profile;
}

export class AuthPayload {
    user: User;
    token: string;
}

export class Profile {
    id: string;
    firstName: string;
    lastName?: Nullable<string>;
    isPublic: boolean;
    userName: string;
}

export class LeagueEntity {
    leagueId: string;
    leagueName: string;
    createdAt: DateTime;
    season: SeasonEntity;
    createdBy: LeagueMemberEntity;
    members: LeagueMemberEntity[];
}

export class LeagueMemberEntity {
    id: string;
    role: LeagueMemberRole;
    user: User;
    league: LeagueEntity;
}

export class SeasonEntity {
    seasonId: number;
    filmingLocation?: Nullable<string>;
    airStartDate?: Nullable<DateTime>;
    airEndDate?: Nullable<DateTime>;
}

export class HealthCheckResult {
    status: string;
    environment: string;
    timestamp: string;
}

export abstract class IQuery {
    abstract healthCheck(): HealthCheckResult | Promise<HealthCheckResult>;

    abstract getMyLeagues(): LeagueEntity[] | Promise<LeagueEntity[]>;

    abstract getAllSeasons(): SeasonEntity[] | Promise<SeasonEntity[]>;

    abstract getSeason(seasonId: number): SeasonEntity | Promise<SeasonEntity>;

    abstract getCurrentSeason(): Nullable<SeasonEntity> | Promise<Nullable<SeasonEntity>>;
}

export abstract class IMutation {
    abstract signup(data: SignupDto): AuthPayload | Promise<AuthPayload>;

    abstract login(data: LoginDto): AuthPayload | Promise<AuthPayload>;

    abstract promoteMemberToAdmin(leagueId: string, targetUserId: string): LeagueMemberEntity | Promise<LeagueMemberEntity>;

    abstract demoteAdminToMember(leagueId: string, targetUserId: string): LeagueMemberEntity | Promise<LeagueMemberEntity>;

    abstract updateMemberRole(input: UpdateMemberRoleDto): LeagueMemberEntity | Promise<LeagueMemberEntity>;

    abstract createLeague(input: CreateLeagueDto): LeagueEntity | Promise<LeagueEntity>;

    abstract createSeason(input: CreateSeasonDto): SeasonEntity | Promise<SeasonEntity>;

    abstract updateSeason(seasonId: number, input: UpdateSeasonDto): SeasonEntity | Promise<SeasonEntity>;

    abstract deleteSeason(seasonId: number): boolean | Promise<boolean>;

    abstract generateInviteCode(leagueId: string, expiresInMinutes: number): string | Promise<string>;

    abstract joinLeagueWithToken(inviteToken: string): LeagueMemberEntity | Promise<LeagueMemberEntity>;
}

export type DateTime = any;
type Nullable<T> = T | null;
