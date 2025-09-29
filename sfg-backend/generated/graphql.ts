
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
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

export class Profile {
    id: string;
    firstName: string;
    lastName?: Nullable<string>;
    isPublic: boolean;
    userName: string;
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

export class HealthCheckResult {
    status: string;
    environment: string;
    timestamp: string;
}

export class SeasonEntity {
    seasonId: number;
    filmingLocation?: Nullable<string>;
    airStartDate?: Nullable<DateTime>;
    airEndDate?: Nullable<DateTime>;
}

export abstract class IQuery {
    abstract healthCheck(): HealthCheckResult | Promise<HealthCheckResult>;

    abstract getAllSeasons(): SeasonEntity[] | Promise<SeasonEntity[]>;

    abstract getSeason(seasonId: number): SeasonEntity | Promise<SeasonEntity>;

    abstract getCurrentSeason(): Nullable<SeasonEntity> | Promise<Nullable<SeasonEntity>>;
}

export abstract class IMutation {
    abstract signup(data: SignupDto): AuthPayload | Promise<AuthPayload>;

    abstract login(data: LoginDto): AuthPayload | Promise<AuthPayload>;

    abstract createSeason(input: CreateSeasonDto): SeasonEntity | Promise<SeasonEntity>;

    abstract updateSeason(seasonId: number, input: UpdateSeasonDto): SeasonEntity | Promise<SeasonEntity>;

    abstract deleteSeason(seasonId: number): boolean | Promise<boolean>;
}

export type DateTime = any;
type Nullable<T> = T | null;
