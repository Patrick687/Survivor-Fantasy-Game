
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

export abstract class IQuery {
    abstract healthCheck(): HealthCheckResult | Promise<HealthCheckResult>;
}

export abstract class IMutation {
    abstract signup(data: SignupDto): AuthPayload | Promise<AuthPayload>;

    abstract login(data: LoginDto): AuthPayload | Promise<AuthPayload>;
}

type Nullable<T> = T | null;
