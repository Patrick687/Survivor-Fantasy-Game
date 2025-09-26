import { UserRole } from "src/user/entities/user-role.enum";

export type JwtPayload = {
    userId: string;
    userRole: UserRole;
};