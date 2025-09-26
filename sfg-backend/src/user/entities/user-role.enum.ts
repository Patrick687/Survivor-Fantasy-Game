import { registerEnumType } from "@nestjs/graphql";

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

registerEnumType(UserRole, {
    name: 'UserRole',
    description: 'The role of the user in the system',
});