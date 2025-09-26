import { User } from "./entities/user.entity";

export class UserDomain {
    constructor(
        public userId: User['userId'],
        public email: User['email'],
        public role: User['role'],
    ) { }
}