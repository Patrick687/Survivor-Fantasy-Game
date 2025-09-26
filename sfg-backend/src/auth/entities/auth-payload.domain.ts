import { UserDomain } from "src/user/user.domain";

export class AuthPayloadDomain {
    public user: UserDomain;
    public token: string;

    constructor(
        user: UserDomain,
        token: string
    ) {
        this.user = user;
        this.token = token;
    }
}